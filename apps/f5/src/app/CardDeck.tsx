import { CardActions, CardContent, Grid, IconButton } from '@material-ui/core';
import React, { useCallback, useState } from 'react'
import { useData } from './firebase';
import ArrowForward from '@material-ui/icons/ArrowForward'; 
import ArrowBack from '@material-ui/icons/ArrowBack'; 


interface CardDeckProps {
  /**
   * comma delimited Deck of ids
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
    const { state } = useData();
    const { Card } = cardDeck;
    const [index, setIndex] = useState(0);
    const [nodes] = useState(
      ids.split(',')
        .map(id => state.nodes.find(n => n.id === id))
    );
    const onNext = useCallback(() => setIndex(index + 1), [index]);
    const onPrev = useCallback(() => setIndex(index - 1), [index]);
    return (
      <>
        <CardActions disableSpacing>
          <Grid container direction="row-reverse">
            <Grid item>
              <IconButton
                aria-label={'edit'}
                onClick={onPrev}
                disabled={index === 0}
              >
                <ArrowBack/>
              </IconButton>
              <IconButton
                aria-label={'edit'}
                onClick={onNext}
                disabled={index === nodes.length - 1}
              >
                <ArrowForward/>
              </IconButton>
            </Grid>
          </Grid>
        </CardActions>
        <CardContent>
          {!nodes[index] &&(
          <Card key={index}>
            No node was found for `node id` with value `{index}`.
            Please check your ids and try again.
          </Card>
          ) || (
          <div>
            <Card key={index}>
              {nodes[index].text}
            </Card>
          </div>
          )}
        </CardContent>
      </>
    );
  }
}