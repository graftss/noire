type Dict<T> = Record<string, T>;

type Maybe<T> = T | undefined;

type Without<O, K extends keyof O> = Pick<O, Exclude<keyof O, K>>;

type CB0 = () => void;
type CB1<A1> = (a1: A1) => void;
type CB2<A1, A2> = (a1: A1, a2: A2) => void;
type Auto<T> = (t: T) => T;

interface Vec2 {
  x: number;
  y: number;
}
