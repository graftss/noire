import { assocPath, map, mapObjIndexed, path } from 'ramda';
import uuidv4 from 'uuid/v4';

export { equals, range } from 'ramda';

export const without = <T>(t: T, ts: T[]): T[] => {
  const idx = ts.indexOf(t);
  if (idx > -1) ts.splice(idx, 1);
  return ts;
};

export const withoutKey = <O, K extends keyof O>(
  o: O,
  key: K,
): Without<O, K> => {
  const { [key]: _, ...rest } = o;
  return rest;
};

export const sign = (x: number): number => (x > 0 ? 1 : x < 0 ? -1 : 0);

// TODO: how do generics interact with readonly?
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cloneArray = <T>(ts: Readonly<T[]>): T[] => ts.map(t => t);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mappedApply = (maps): any => mapObjIndexed((v, k) => maps[k](v));

export const mappedEval = maps => k => map(f => f(k), maps);

export const find = <T>(pred: (t: T) => boolean, list: T[]): Maybe<T> => {
  for (let i = 0; i < list.length; i++) {
    if (pred(list[i])) return list[i];
  }
};

export const defaults = <T>(source: Partial<T>, target: T): T => {
  for (let key in source) {
    target[key] = (target[key] !== undefined
      ? target[key]
      : source[key]) as T[typeof key];
  }

  return target;
};

export const uuid = (): string => uuidv4();

export const keyBy = <T>(ts: T[], map: (t: T) => string | number): Dict<T> => {
  return (ts || []).reduce((result, t) => ({ ...result, [map(t)]: t }), {});
};

export const values = <T>(map: Dict<T>): T[] => {
  const result: T[] = [];
  for (const k in map) result.push(map[k]);
  return result;
};

export const mapIf = <T>(
  ts: T[],
  pred: (t: T) => boolean,
  f: (t: T) => T,
): T[] => ts.map(t => (pred(t) ? f(t) : t));

export const mapObj = <K extends string, T, U>(
  ts: Record<K, T>,
  f: (t: T) => U,
): Record<K, U> => {
  const result: Partial<Record<K, U>> = {};
  for (let k in ts) result[k] = f(ts[k]);
  return result as Record<K, U>;
};

export const shallowCloneObj = <K extends string, T>(
  obj: Record<K, T>,
): Record<K, T> => mapObj(obj, x => x);

export const mapPath = <T, O>(p: string[], f: (t: Maybe<T>) => T, o: O): O =>
  assocPath(p, f(path(p, o)), o);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const cast = <U>(isU: (t: any) => boolean, t: any): Maybe<U> =>
  isU(t) ? t : undefined;

export const toPairs = <T>(obj: Dict<T>): [string, T][] => {
  const result: [string, T][] = [];

  for (const key in obj) {
    result.push([key, obj[key]]);
  }

  return result;
};

export const unMaybeList = <T>(mts: Maybe<T>[]): T[] => {
  const result: T[] = [];
  for (const mt of mts) mt && result.push(mt);
  return result;
};

export const toPrecision = (x: number, digits: number): number =>
  Number(x.toFixed(digits));

export const vec2 = {
  add: (v: Vec2, w: Vec2): Vec2 => ({ x: v.x + w.x, y: v.y + w.y }),
};
