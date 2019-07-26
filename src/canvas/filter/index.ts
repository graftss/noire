import * as T from '../../types';

export type Filter<S> = (state: S) => (i: ImageData) => void;

export type InputFilter<I extends Dict<T.RawInput>, C> = Filter<{
  input: I;
  config: C;
}>;
