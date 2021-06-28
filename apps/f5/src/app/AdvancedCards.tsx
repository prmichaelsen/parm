import React from 'react';
import { cardDeck } from './CardDeck';
import { Markdown } from './Markdown';

cardDeck.Card = ({ children }) => <Markdown>{children}</Markdown>;

export const { CardDeck } = cardDeck;