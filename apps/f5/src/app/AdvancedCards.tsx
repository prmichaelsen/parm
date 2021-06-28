import React from 'react';
import { cardList } from './CardList';
import { Markdown } from './Markdown';

cardList.Card = ({ children }) => <Markdown>{children}</Markdown>;

export const { CardList } = cardList;