import * as T from '../../types';
import { stickDistort } from './distort';
import { buttonZoom } from './zoom';

export interface InputFilterData {
  buttonZoom: T.ButtonZoomData;
  stickDistort: T.StickDistortData;
}

const inputFilters: { [K in InputFilterKind]: InputFilter<K> } = {
  buttonZoom,
  stickDistort,
};

export type Filter<S> = (state: S) => (i: ImageData) => void;

export type TypedInputFilter<C, I extends Dict<T.RawInput>> = (
  config: C,
) => Filter<I>;

export type InputFilterKind = keyof InputFilterData;

export type InputFilter<K extends InputFilterKind> = TypedInputFilter<
  InputFilterData[K]['config'],
  InputFilterData[K]['input']
>;

export interface SerializedInputFilter<K extends InputFilterKind> {
  kind: K;
  config: InputFilterData[K]['config'];
}

export const deserializeInputFilter = <K extends InputFilterKind>(
  filter: SerializedInputFilter<K>,
): InputFilter<K> => inputFilters[filter.kind];
