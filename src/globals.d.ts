type Dict<T> = Record<string, T>;

type Maybe<T> = T | undefined;

type Without<O, K extends keyof O> = Pick<O, Exclude<keyof O, K>>;

type CB1<T> = (t: T) => void;
type CB2<T, U> = (t: T, u: U) => void;
