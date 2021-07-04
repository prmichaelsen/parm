import { ListItem } from '@material-ui/core';
import React from 'react';
import { fromJsString } from './utils';

interface NavTree {
  id: string,
  title: string,
  children?: NavTree;
}

export const EasyNav = (_navTree: string) => {
  let navTree: NavTree[];
  try {
    navTree = fromJsString(_navTree);
  } catch (e) {
    console.log(e);
    return `Failed to load. Error:\n${e}`;
  }
  return render(navTree);
};

const render = (navTree: NavTree[]) => (
  navTree.map(n => {
    const { title, id } = n;
    return (
      <ListItem
        button
        component="a"
        aria-label={title}
        href={`/?focus=${id}`}
      >
        {title} 
      </ListItem>
    )
  })
)