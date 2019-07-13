type Maybe<T> = T | undefined;

type Without<O, K extends keyof O> = Pick<O, Exclude<keyof O, K>>;
