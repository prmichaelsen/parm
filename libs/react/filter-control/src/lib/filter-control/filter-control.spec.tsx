import React from 'react';
import { render } from '@testing-library/react';

import useFilter, { filterFactory } from './filter-control';

const Component = () => {
  const { control } = useFilter();
  return control;
};

const items = ['cats', 'dogs', 'birds', 'dogs and birds', 'cats and dogs'];
describe(' FilterControl', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Component/>);
    expect(baseElement).toBeTruthy();
  });
  it('filters and', () => {
    const filter = filterFactory('cats AND dogs');
    expect(items.filter(filter)).toEqual([
      'cats and dogs',
    ]);
  });
  it('filters or', () => {
    const filter = filterFactory('cats OR dogs');
    expect(items.filter(filter)).toEqual([
      'cats',
      'dogs',
      'dogs and birds',
      'cats and dogs',
    ]);
  });
  it('filters and or', () => {
    const filter = filterFactory('birds AND cats OR dogs');
    expect(items.filter(filter)).toEqual([
      'dogs and birds',
    ]);
  });
  it('filters default', () => {
    const filter = filterFactory('birds');
    expect(items.filter(filter)).toEqual([
      'birds',
      'dogs and birds',
    ]);
  });
});
