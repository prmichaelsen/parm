import { 
  firebase as firebaseSecrets,
  dedupe,
} from '@parm/util';
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
  env, app, Node, NodeMeta, database
});

import { useState, useEffect, useCallback } from 'react';
import { storage } from './storage';
import uuidv1 from 'uuid/v1';
import { StringParam, useQueryParams } from 'use-query-params';

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
  root: Option,
  current: string,
}

const initialState: State = {
  nodes: [],
  root: null,
  current: null,
}; 

const nodesCache: {[id: string]: Option} = {};

const fetchRootId = async () => {
  const d = await db.collection(Node)
    .where('isRoot', '==', true).get();
  const rootId: string = d.docs.map(d => d.id)[0];
  return rootId;
}

const fetch = async (id: string, forceFetch = false): Promise<Option | undefined> => {
  if (nodesCache[id] && !forceFetch)
    return nodesCache[id];
  const d = await db.collection(Node).doc(id).get();
  const data = d.data();
  console.log({
    id, data,
  });
  if (data === null || data === undefined) {
    console.error(`No data found for option with id: ${id}`);
    return undefined;
  }
  const node: Option = {
    id: d.id,
    ...data as Option,
    // firebase encodes \n as \\n
    text: data.text
      .replace(/\\\n/g, '\n')
      .replace(/\\\t/g, '\t')
  };
  nodesCache[id] = node;
  return node;
}

const fetchMany = async (ids: string[]): Promise<Array<Option>> => {
  const promises = ids.map(id => fetch(id));
  const results = await Promise.all(promises);
  return results.filter(n => n !== null && n !== undefined);
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
      setUrls(await Promise.all(result.items.map(i =>
        i.getDownloadURL()
      )));
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
    const id = `${ImagesStore}/${uuid}`;
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
        return [];
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
    (async () => {
      const currentNode = state.nodes.find(n => n.id === current);
      const children = await fetchMany(currentNode.children);
      setState({
          ...state,
          nodes: dedupe([...state.nodes, ...children], n => n.id),
          current,
      });
    })();
  };
  async function updateNode({ text, id }: { text: string, id: string }) {
    const updateTime = firebase.firestore.Timestamp.fromDate(new Date());
    await db.collection(Node).doc(id).set({
      text,
      updateTime,
    }, { merge: true });
    const node = await fetch(id, true);
    // remove the updated node from the list and
    // reinsert it
    let nodes = [...state.nodes];
    let index = nodes.findIndex(n => n.id === id);
    nodes = nodes.splice(index, 1, node);

    setState({
        ...state,
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
    const id = optionRef.id;
    const option = await fetch(id);
    let parentNode = state.nodes.find(n => n.id === parent);
    parentNode.children.push(option.id);
    await db.collection(Node).doc(parentNode.id).update(parentNode);
    await fetch(parentNode.id, true);
    setState({
      ...state,
      nodes: Object.keys(nodesCache).map(id => nodesCache[id]),
      current: option.id,
    });
  }
  useEffect(() => {
    (async () => {
      const rootId = await fetchRootId();
      const root = await fetch(rootId);

      const search = new URLSearchParams(window.location.search);
      const to = search.get('to');
      const from = search.get('from');

      const nodes: Option[] = [
        root,
        ...(await fetchMany(root.children)),
      ];
      if (to !== undefined && to !== rootId) {
        let searchId = from || rootId;
        let it = await fetch(to);
        nodes.push(...await fetchMany(it.children));
        while (it && it.id !== searchId && it.parent) {
          nodes.push(it);
          const parent = await fetch(it.parent);
          it = parent;
        }
      }
      
      setState({
        ...state,
        nodes,
        root,
      });
    })();
  }, [guid]);
  return {
    state,
    setCurrent,
    createOption,
    updateNode,
  }
}
