import * as T from '../../types';
import { stickDistort } from './distort';

export type Filter<S> = (state: S) => (i: ImageData) => void;

export type TypedInputFilter<C, I extends Dict<T.RawInput>> = (
  config: C,
) => Filter<I>;

export interface InputFilterData {
  stickDistort: T.StickDistortData;
}

export type InputFilterKind = keyof InputFilterData;

export type InputFilter<K extends InputFilterKind> = TypedInputFilter<
  InputFilterData[K]['config'],
  InputFilterData[K]['input']
>;

export interface SerializedInputFilter<K extends InputFilterKind> {
  kind: K;
  config: InputFilterData[K]['config'];
}

const inputFilters: { [K in InputFilterKind]: InputFilter<K> } = {
  stickDistort,
};

export const deserializeInputFilter = <K extends InputFilterKind>(
  filter: SerializedInputFilter<K>,
): InputFilter<K> => inputFilters[filter.kind];
