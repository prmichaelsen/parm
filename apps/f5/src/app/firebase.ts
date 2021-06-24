import { firebase as firebaseSecrets } from '@parm/util';
import * as firebase from 'firebase/app';
import { environment } from '../environments/environment';

// Add the Firebase services that you want to use
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// only dev uses separate data collections.
// prod and qa share their data collections.
const env = environment.stage === 'dev' ? 'dev' : null;
const app = environment.app;
const database = environment.database || 'default';
const Node = env ? `${env}.${app}` : app;
const NodeMeta = `${app}.meta`;
const Roles = `${app}.roles`;

// Initialize Cloud Firestore through Firebase
// Initialize Firebase
firebase.initializeApp(firebaseSecrets[database]);

var db = firebase.firestore();

const ImagesStore = `${app}/images`;
console.log({
  env, app, Node, NodeMeta
});

import { useState, useEffect, useCallback } from 'react';
import { storage } from './storage';
import uuidv1 from 'uuid/v1';
import { StringParam, useQueryParams } from 'use-query-params';
import { getImageUrl } from './utils';

export interface RoleDocument {
  roles: string[];
}

export interface Option {
  parent: string;
  children: string[];
  text: string;
  id: string;
  type: 'prompt' | 'action';
  creatorId: string;
  createTime: firebase.firestore.Timestamp;
}

interface State {
  nodes: Option[],
  prev: Option[],
  root: Option,
  current: string,
}

const initialState: State = {
  nodes: [],
  prev: [],
  root: null,
  current: null,
}; 

const fetch = async () => {
  const e = await db.collection(Node).get();
  const nodes: any[] = e.docs.map(d => ({
    id: d.id,
    ...d.data(),
    // firebase encodes \n as \\n
    text: d.data().text
      .replace(/\\\n/g, '\n')
      .replace(/\\\t/g, '\t')
  }));
  return {
    nodes,
    root: nodes.find(n => n.isRoot),
  }
}

interface NodeMeta {
  /**
   * user ids of those who liked it
   */
  likes: string[],
  /**
   * user ids of those who visited this node once or more
   */
  visited: string[],
  /**
   * num times this node's route was loaded
   */
  views: number,
}

const initialNodeMeta: NodeMeta = {
  likes: [],
  visited: [],
  views: 0,
}

export function useImages(limit: number = 1000) {
  const [pageToken, setPageToken] = useState(null);
  const [urls, setUrls] = useState([]);
  const ref = firebase.storage().ref(ImagesStore);
  const nextPage = () => {
    ref.list({
      maxResults: limit,
      pageToken: pageToken,
    }).then(async (result) => {
      setPageToken(result.nextPageToken);
      setUrls(await Promise.all(result.items.map(async i => {
        return getImageUrl({filename: i.name});
      })));
    }).catch((e) => { throw new (e); });
  }
  if (pageToken === null)
    nextPage();
  return {
    nextPage,
    urls,
  }
}

export function useImageUpload() {
  const uploadImage = async (file: File) => {
    const uuid = uuidv1();
    const ext = file.type.split('/')[1];
    const id = `${ImagesStore}/${uuid}.${ext}`;
    const ref = firebase.storage().ref(id);
    const metadata = {
      contentType: file.type,
    }
    try {
      return await ref.put(file, metadata);
    } catch (e) {
      console.log(e)
    }
  }

  return {
    uploadImage,
  };
}

/**
 * reference https://reacttraining.com/blog/react-router-v5-1/
 * @deprecated currently deprecated because useMeta
 * was driving up daily reads into quota limits. The view 
 * counting was broken anyway. Metadata should be a part of
 * the primary document to avoid two document reads for
 * one logical set of data (more cost effective).
 */
export function useNodeView(nodeId: string) {
  // just return dummy meta.
  // this isn't persisted anywhere.
  return {
    views: 0,
  }
}

export function useRoles() {
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    const userId = storage.userId();
    db.collection(Roles).doc(userId).onSnapshot(e => {
      const doc = e.data();
      if (!doc)
        return;
      setRoles(doc.roles || []);
    });
  });
  return roles;
}

/*
 * @deprecated currently deprecated because useMeta
 * was driving up daily reads into quota limits. The view 
 * counting was broken anyway. Metadata should be a part of
 * the primary document to avoid two document reads for
 * one logical set of data (more cost effective).
 */
export function useMeta(nodeId: string) {
  const [meta, setMeta] = useState({...initialNodeMeta});
  // just return dummy meta or set meta locally.
  // this isn't persisted anywhere.
  return {
    meta,
    setMeta: (meta: NodeMeta) => 
      setMeta({ ...meta })
    ,
  };
}

export function useData() {
  const [state, setState] = useState({...initialState});
  const [guid, setGuid] = useState(uuidv1());
  const setCurrent = (current: string) => {
    setState({
        ...state,
        current,
        prev: [...state.prev, state.nodes.find(n => n.id === current)],
    });
  };
  async function updateNode({ text, id }: { text: string, id: string }) {
    const updateTime = firebase.firestore.Timestamp.fromDate(new Date());
    await db.collection(Node).doc(id).set({
      text,
      updateTime,
    }, { merge: true });
    const { nodes, root } = await fetch();
    setState({
        ...state,
        root,
        nodes,
    });
  };
  async function createOption({ text, parent, type }: { text: string, parent: string, type: 'prompt' | 'action' }) {
    const creatorId = storage.userId();
    const createTime = firebase.firestore.Timestamp.fromDate(new Date());
    const optionRef = await db.collection(Node).add({
      creatorId,
      createTime,
      text,
      children: [],
      parent,
      type,
    });
    const option: Option = {
      creatorId: storage.userId(),
      createTime,
      text,
      children: [],
      parent,
      type,
      id: optionRef.id,
    };
    let parentNode = state.nodes.find(n => n.id === parent);
    parentNode.children.push(option.id);
    await db.collection(Node).doc(parentNode.id).update(parentNode);
    const { nodes, root } = await fetch();
    parentNode = nodes.find(n => n.id === parent);
    setState({
        root,
        nodes,
        current: option.id,
        prev: [...state.prev, option],
    });
  }
  useEffect(() => {
    fetch().then(({nodes, root}) => setState({
        ...state,
        nodes,
        root,
      }));
  }, [guid]);
  return {
    state,
    setCurrent,
    createOption,
    updateNode,
  }
}
