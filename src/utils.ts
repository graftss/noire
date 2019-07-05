import { map, mapObjIndexed } from 'ramda';
import uuidv4 from 'uuid/v4';

export const without = <T>(t: T, ts: T[]): T[] => {
  const idx = ts.indexOf(t);

  if (idx > -1) {
    ts.splice(idx, 1);
  }

  return ts;
};

export const sign = (x: number): number => (x > 0 ? 1 : x < 0 ? -1 : 0);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const clone = (obj: Record<string, any>): any =>
  JSON.parse(JSON.stringify(obj));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mappedApply = (maps): any => mapObjIndexed((v, k) => maps[k](v));

export const mappedEval = maps => k => map(f => f(k), maps);

export const find = <T>(pred: (t: T) => boolean) => (
  list: T[],
): T | undefined => {
  for (let i = 0; i < list.length; i++) {
    if (pred(list[i])) return list[i];
  }
};

export const defaults = <T extends {}>(source: T, target: T): T => {
  for (let key in source) {
    target[key] = target[key] !== undefined ? target[key] : source[key];
  }

  return target;
};

export const uuid = (): string => uuidv4();
