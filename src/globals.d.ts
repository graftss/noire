type Dict<T> = Record<string, T>;

type Maybe<T> = T | undefined;

type Without<O, K extends keyof O> = Pick<O, Exclude<keyof O, K>>;

type CB0 = () => void;
type CB1<T> = (t: T) => void;
type CB2<T, U> = (t: T, u: U) => void;
type Auto<T> = (t: T) => T;

interface Vec2 {
  x: number;
  y: number;
}
