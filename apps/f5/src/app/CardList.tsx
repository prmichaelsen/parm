import React from 'react'
import { useData } from './firebase';


interface CardListProps {
  /**
   * comma delimited list of ids
   */
  ids: string;
}

interface cardList {
  CardList: any,
  Card: null | React.Component,
}

export const cardList = {
  Card: null,
  CardList: function ({
    ids
  }: CardListProps) {
    const { state } = useData();
    const { Card } = cardList;
    return (
      <div>
        {ids.split(',').map((id) => {
          const node = state.nodes.find(n => n.id === id);
          if (!node) {
            return (
              <Card key={id}>
                No node was found for `node id` with value `{id}`.
                Please check your ids and try again.
              </Card>
            );
          }
          return (
            <Card key={id}>
              {node.text}
            </Card>
          )
        })}
      </div>
    );
  }
}