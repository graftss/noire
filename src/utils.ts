import { map, mapObjIndexed } from 'ramda';

export const sign = (x: number) => x > 0 ? 1 : x < 0 ? -1 : 0;

export const clone = (obj: Object): any => JSON.parse(JSON.stringify(obj));

export const mappedApply = maps => mapObjIndexed((v, k) => maps[k](v));

export const mappedEval = maps => k => map(f => f(k), maps);

export const find = <T>(pred: (t: T) => boolean) => (list: T[]): T | undefined => {
  for (let i = 0; i < list.length; i++) {
    if (pred(list[i])) return list[i];
  }
};
