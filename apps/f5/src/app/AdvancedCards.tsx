import React from 'react';
import { cardList } from './CardList';
import { cardDeck } from './CardDeck';
import { Markdown } from './Markdown';

cardList.Card = ({ children }) => <Markdown>{children}</Markdown>;
export const { CardList } = cardList;

cardDeck.Card = ({ children }) => <Markdown>{children}</Markdown>;
export const { CardDeck } = cardDeck;