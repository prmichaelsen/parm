import React from 'react'
import { useData } from './firebase';


interface CardDeckProps {
  /**
   * comma delimited list of ids
   */
  ids: string;
}

interface cardDeck {
  CardDeck: any,
  Card: null | React.Component,
}

export const cardDeck = {
  Card: null,
  CardDeck: function ({
    ids
  }: CardDeckProps) {
    const {
      state, updateNode,
      setCurrent,
    } = useData();
    const { Card } = cardDeck;
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