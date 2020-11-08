import { useField } from '@parm/react/use-field';

import './filter-control.scss';

/* eslint-disable-next-line */
export interface FilterControlProps {}

export type UseFilter = () => {
  /** 
   * function that filters strings 
   * based of internal filter state
  */
  filter: (item: string) => boolean;
  /**
   * a jsx element that can control
   * and display filter state
   */
  control: JSX.Element;
}

const containsStr = (a: string, b: string) => {
  return a
    .toLowerCase()
    .trim()
    .includes(b.toLowerCase().trim());
}

export const filterFactory = (value: string) => (v: string) => {
  if (value.trim() === '')
    return true;
  const andClauses = value.split('AND')
    .map(and => and.trim())
    .map(and => and.split('OR')
      .map(or => or.trim())
     );
  return andClauses.every(ands =>
    ands.some(or => containsStr(v, or))
  );
};

  /** 
   * function that filters nodes 
   * based of internal filter state
  */
export const useFilter: UseFilter = () => {
  const {
    value,
    field,
  } = useField({
    value: '',
    label: 'Search',
  });

  const filter = filterFactory(value);
  return {
    control: field,
    filter,
  };
};

export default useFilter;
