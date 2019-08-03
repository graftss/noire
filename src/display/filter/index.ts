import * as T from '../../types';
import { toPairs } from '../../utils';
import {
  stickDistort,
  dPadDistort,
  stickDistortInputKinds,
  dPadDistortInputKinds,
} from './distort';
import { buttonZoom } from './zoom';

export interface InputFilterData {
  buttonZoom: T.ButtonZoomData;
  dPadDistort: T.DPadDistortData;
  stickDistort: T.StickDistortData;
}

const inputFilters: { [K in InputFilterKind]: InputFilterFactory<K> } = {
  buttonZoom,
  dPadDistort,
  stickDistort,
};

export type Filter = (i: ImageData) => void;

export type FilterFactory<S = {}> = (state: S) => (i: ImageData) => void;

export type InputFilterKind = keyof InputFilterData;

export type InputFilterFactory<K extends InputFilterKind> = FilterFactory<{
  state: InputFilterData[K]['state'];
  input: InputFilterData[K]['input'];
}>;

export interface SerializedInputFilter<K extends InputFilterKind> {
  kind: K;
  state: InputFilterData[K]['state'];
}

export const deserializeInputFilter = <K extends InputFilterKind>(
  filter: SerializedInputFilter<K>,
): InputFilterFactory<K> => inputFilters[filter.kind];

const filterInputKinds: Record<T.InputFilterKind, Dict<T.InputKind>> = {
  stickDistort: stickDistortInputKinds,
  dPadDistort: dPadDistortInputKinds,
  buttonZoom: {},
};

export const getInputFilterKeyList = (
  filter: SerializedInputFilter<T.InputFilterKind>,
): { filterKey: string; inputKind: T.InputKind }[] => {
  return toPairs(filterInputKinds[filter.kind]).map(
    ([filterKey, inputKind]) => ({ filterKey, inputKind }),
  );
};

export const getFilterInputKind = (
  filter: SerializedInputFilter<T.InputFilterKind>,
  filterKey: string,
): T.InputKind => filterInputKinds[filter.kind][filterKey];
