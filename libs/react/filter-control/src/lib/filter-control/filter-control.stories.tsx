import React from 'react';
import { storiesOf } from '@storybook/react';
import { useFilter } from './filter-control';

export const Component = () => {
  const items = ['cats', 'dogs', 'birds', 'dogs and birds', 'cats and dogs'];
  const { filter, control } = useFilter();
  const filteredItems = items.filter(filter);
  return (
    <div>
      {control}
      Filtered List:
      {filteredItems.map((v, i) => <div key={i}>{v}</div>)}
    </div>
  );
};

storiesOf('FilterControl', module)
  .add('default', () => <Component/>);