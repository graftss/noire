import { map, mapObjIndexed } from 'ramda';
import uuidv4 from 'uuid/v4';

export const without = <T>(t: T, ts: T[]): T[] => {
  const idx = ts.indexOf(t);

  if (idx > -1) {
    ts.splice(idx, 1);
  }

  return ts;
};

export const sign = (x: number) => x > 0 ? 1 : x < 0 ? -1 : 0;

export const clone = (obj: Object): any => JSON.parse(JSON.stringify(obj));

export const mappedApply = maps => mapObjIndexed((v, k) => maps[k](v));

export const mappedEval = maps => k => map(f => f(k), maps);

export const find = <T>(pred: (t: T) => boolean) => (list: T[]): T | undefined => {
  for (let i = 0; i < list.length; i++) {
    if (pred(list[i])) return list[i];
  }
};

export const defaults = <T extends {}>(source: T, target: T): T => {
  for (let key in source) {
    target[key] = (target[key] !== undefined) ? target[key] : source[key];
  }

  return target;
};

export const uuid = () => uuidv4();
