import { assocPath, path } from 'ramda';
import uuidv4 from 'uuid/v4';
import { equals } from 'ramda';

export { assocPath, equals, path, range } from 'ramda';

export const inProduction = (): boolean =>
  process.env.NODE_ENV === 'production';

export const without = <T>(t: T, ts: T[]): T[] => {
  const idx = ts.indexOf(t);
  if (idx > -1) ts.splice(idx, 1);
  return ts;
};

export const sign = (x: number): number => (x > 0 ? 1 : x < 0 ? -1 : 0);

export const cloneArray = <T>(ts: Readonly<T[]>): T[] => ts.map(t => t);

export const uuid = (): string => uuidv4();

export const keyBy = <T>(map: (t: T) => string, ts: T[]): Dict<T> => {
  return (ts || []).reduce((result, t) => ({ ...result, [map(t)]: t }), {});
};

export const every = <T>(pred: (t: T) => boolean, list: T[]): boolean =>
  list.reduce((result, t) => result && pred(t), true);

export const find = <T>(pred: (t: T) => boolean, list: T[]): Maybe<T> => {
  for (let i = 0; i < list.length; i++) {
    if (pred(list[i])) return list[i];
  }
};

export const findIndex = <T>(
  pred: (t: T) => boolean,
  list: T[],
): Maybe<number> => {
  for (let i = 0; i < list.length; i++) {
    if (pred(list[i])) return i;
  }
};

export const values = <T>(map: Dict<T>): T[] => {
  const result: T[] = [];
  for (const k in map) result.push(map[k]);
  return result;
};

export const keys = <T extends string>(map: Record<T, any>): T[] => {
  const result: T[] = [];
  for (const k in map) result.push(k);
  return result;
};

export const mapIf = <T>(
  pred: (t: T) => boolean,
  f: (t: T) => T,
  ts: T[],
): T[] => ts.map(t => (pred(t) ? f(t) : t));

export const mapObj = <K extends string, T, U>(
  f: (t: T) => U,
  ts: Record<K, T>,
): Record<K, U> => {
  const result: Partial<Record<K, U>> = {};
  for (const k in ts) result[k] = f(ts[k]);
  return result as Record<K, U>;
};

export const mapPath = <T, O>(
  p: (string | number)[],
  f: (t: Maybe<T>) => T,
  o: O,
): O => assocPath(p, f(path(p, o)), o);

export const shallowCloneObj = <K extends string, T>(
  obj: Record<K, T>,
): Record<K, T> => mapObj(x => x, obj);

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

export const unMaybeObj = <T>(mto: Dict<Maybe<T>>): Dict<T> => {
  const result: Dict<T> = {};
  for (const k in mto) {
    const mt = mto[k];
    if (mt) result[k] = mt;
  }
  return result;
};

export const toPrecision = (x: number, digits: number): number =>
  Number(x.toFixed(digits));

export const vec2 = {
  add: (v: Vec2, w: Vec2): Vec2 => ({ x: v.x + w.x, y: v.y + w.y }),
};

export const normalizeAxis = (pos: number, neg: number): number =>
  pos > 0 ? pos : neg > 0 ? -neg : 0;

export const noop = (): void => {};

export const assoc = <K extends string, V>(
  obj: Record<K, V>,
  key: K,
  value: V,
): Record<K, V> => ({
  ...obj,
  [key]: value,
});

export const equalAtKeys = <KS extends string, O extends Record<KS, any>>(
  keys: KS[],
  o1: O,
  o2: O,
): boolean => {
  for (let i = 0; i < keys.length; i++) {
    if (!equals(o1[keys[i]], o2[keys[i]])) return false;
  }

  return true;
};

export const runOnEnterKeydown = (
  f: (e: React.KeyboardEvent<HTMLInputElement>) => void,
) => (e: React.KeyboardEvent<HTMLInputElement>): void => {
  if (e.keyCode === 13) f(e);
};

export const defaultTo = <T>(value: Maybe<T>, defaultValue: T): T =>
  value === undefined ? defaultValue : value;

export const flatMap = <T, U>(map: (t: T) => U[], list: T[]): U[] =>
  list.reduce((result, t) => result.concat(map(t)), [] as U[]);

export const clipboard = {
  read: (): Promise<string> => navigator.clipboard.readText(),
  write: (s: string): Promise<void> => navigator.clipboard.writeText(s),
};

// returns the parsed JSON object if valid, and undefined if invalid.
export const validateJSONString = (validate: (o: any) => boolean) => (
  str: string,
): any => {
  try {
    const o = JSON.parse(str);
    if (o && validate(o)) return o;
  } catch (e) {}
};

export const tryClipboardParse = <T>(
  parse: (s: string) => Maybe<T>,
  onSuccess: (t: T) => void,
  onFail: () => void,
): Promise<void> =>
  clipboard
    .read()
    .then(parse)
    .then(maybeT => (maybeT ? onSuccess(maybeT) : onFail()));
