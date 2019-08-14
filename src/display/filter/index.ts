import * as T from '../../types';
import { keys, toPairs } from '../../utils';
import {
  stickDistort,
  dPadDistort,
  stickDistortInputKinds,
  dPadDistortInputKinds,
  distortStateFields,
  defaultDPadDistortState,
  defaultStickDistortState,
} from './distort';
import { buttonZoom, defaultButtonZoomState } from './zoom';

export interface InputFilterData {
  buttonZoom: T.ButtonZoomData;
  dPadDistort: T.DPadDistortData;
  stickDistort: T.StickDistortData;
}

const inputFilterClasses: Record<InputFilterKind, string> = {
  buttonZoom: 'zoom',
  dPadDistort: 'distort',
  stickDistort: 'distort',
};

export type Filter = (i: ImageData) => void;

export type FilterFactory<S = {}> = (state: S) => (i: ImageData) => void;

export type InputFilterKind = keyof InputFilterData;

export type InputFilterState<
  K extends InputFilterKind = InputFilterKind
> = InputFilterData[K]['state'];

export type InputFilterInput<
  K extends InputFilterKind = InputFilterKind
> = InputFilterData[K]['input'];

export type InputFilterFactory<K extends InputFilterKind> = FilterFactory<{
  state: InputFilterState<K>;
  input: InputFilterInput<K>;
}>;

export interface SerializedInputFilter<
  K extends InputFilterKind = InputFilterKind
> {
  kind: K;
  state: InputFilterState<K>;
}

export interface InputFilterField<
  K extends InputFilterKind = InputFilterKind,
  FK extends T.EditorFieldKind = T.EditorFieldKind
> extends T.EditorField<FK> {
  getter: (s: InputFilterState<K>) => T.EditorFieldType<FK>;
  setter: (
    s: InputFilterState<K>,
    v: T.EditorFieldType<FK>,
  ) => InputFilterState<K>;
}

const inputFilters: { [K in InputFilterKind]: InputFilterFactory<K> } = {
  buttonZoom,
  dPadDistort,
  stickDistort,
} as const;

const filterInputKinds: Record<T.InputFilterKind, Dict<T.InputKind>> = {
  stickDistort: stickDistortInputKinds,
  dPadDistort: dPadDistortInputKinds,
  buttonZoom: {},
} as const;

const defaultInputFilterStates: {
  [K in InputFilterKind]: InputFilterState<K>;
} = {
  stickDistort: defaultStickDistortState,
  dPadDistort: defaultDPadDistortState,
  buttonZoom: defaultButtonZoomState,
};

export const getInputFilterKinds = (): InputFilterKind[] => [
  ...keys(inputFilters),
];

export const deserializeInputFilter = <K extends InputFilterKind>(
  filter: SerializedInputFilter<K>,
): InputFilterFactory<K> => inputFilters[filter.kind];

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

const inputFilterFields: Record<InputFilterKind, InputFilterField[]> = {
  stickDistort: distortStateFields,
  dPadDistort: distortStateFields,
  buttonZoom: [],
};

export const getInputFilterFields = (
  kind: InputFilterKind,
): InputFilterField[] => inputFilterFields[kind];

export const defaultInputFilter = (
  kind: InputFilterKind,
  oldFilter?: SerializedInputFilter,
): SerializedInputFilter => ({
  kind,
  state:
    oldFilter && inputFilterClasses[kind] === inputFilterClasses[oldFilter.kind]
      ? oldFilter.state
      : { ...defaultInputFilterStates[kind] },
});
