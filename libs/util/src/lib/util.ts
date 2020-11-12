import { isObject } from 'util';

export type Complete<T> = { [P in keyof T]-?: NonNullable<T[P]>};

export const not =
  <T>(predicate: (o: T) => boolean) =>
    (o: T) => !predicate(o);

export const isTruthy = (o: any) => !!o;

export const initConfig = <T>(config: T): Complete<T> => {
  const warnings = [];
  const validate = (path, o) => {
    Object.keys(o).forEach(key => {
      const val = o[key];
      if (isObject(val)) {
        validate(path ? `${path}.${key}` : key, val);
      }
      if (val === '' || val === undefined) {
        warnings.push(`Could not load configuration for '${key}'.`);
      }
    });
  }
  validate('', config);
  if (warnings.length > 0) {
    warnings.forEach(warning => console.warn(warning));
    throw new Error('Some configuration variables could not be loaded. Exiting.');
  }
  return config as any;
} 

export const range = size => [...Array(size).keys()]; 

export function dedupe<T>(items: T[], accessor: (a: T) => string) {
  let unique = {};
  items.forEach(function(i) {
    if(!unique[accessor(i)]) {
      unique[accessor(i)] = true;
    }
  });
  const uniqueKeys = Object.keys(unique);
  return items.filter(n => uniqueKeys.some(k => k === accessor(n)));
}