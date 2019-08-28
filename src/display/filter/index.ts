import * as T from '../../types';
import { assocPath, keys, path, validateJSONString } from '../../utils';
import {
  stickDistort,
  dPadDistort,
  stickDistortInputFields,
  dPadDistortInputFields,
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

export type FilterFactory<C> = (c: C) => Filter;

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

export interface InputFilterInputField {
  key: string;
  label: string;
  inputKind: T.InputKind;
}

export interface InputFilter<K extends InputFilterKind = InputFilterKind> {
  kind: K;
  state: InputFilterState<K>;
  inputMap: Dict<T.ControllerKey>;
}

export interface InputFilterField<
  K extends InputFilterKind = InputFilterKind,
  FK extends T.EditorFieldKind = T.EditorFieldKind
> extends T.EditorField<FK> {
  getter: (s: InputFilter<K>) => T.EditorFieldType<FK>;
  setter: (s: InputFilter<K>, v: T.EditorFieldType<FK>) => InputFilter<K>;
}

const inputFilterFactories: {
  [K in InputFilterKind]: InputFilterFactory<K>;
} = {
  buttonZoom,
  dPadDistort,
  stickDistort,
} as const;

const inputFilterKinds: InputFilterKind[] = keys(inputFilterFactories);

const filterInputFields: Record<
  T.InputFilterKind,
  Readonly<InputFilterInputField[]>
> = {
  stickDistort: stickDistortInputFields,
  dPadDistort: dPadDistortInputFields,
  buttonZoom: [],
} as const;

const defaultInputFilterStates: {
  [K in InputFilterKind]: InputFilterState<K>;
} = {
  stickDistort: defaultStickDistortState,
  dPadDistort: defaultDPadDistortState,
  buttonZoom: defaultButtonZoomState,
};

export const getInputFilterKinds = (): InputFilterKind[] => [
  ...inputFilterKinds,
];

const inputFilterFields: Record<InputFilterKind, InputFilterField[]> = {
  stickDistort: distortStateFields,
  dPadDistort: distortStateFields,
  buttonZoom: [],
};

export const reifyInputFilter = <K extends InputFilterKind>(
  filter: InputFilter<K>,
  input: Dict<T.RawInput>,
): Filter =>
  (inputFilterFactories[filter.kind] as InputFilterFactory<K>)({
    state: filter.state as InputFilterState<K>,
    input: input as InputFilterInput<K>,
  });

export const getInputFilterInputFields = (
  kind: T.InputFilterKind,
): T.InputFilterInputField[] => [...filterInputFields[kind]];

export const getInputFilterControllerKey = (
  filter: InputFilter,
  inputKey: string,
): Maybe<T.ControllerKey> => path(['inputMap', inputKey], filter);

export const setInputFilterControllerKey = (
  filter: InputFilter,
  inputKey: string,
  controllerKey: T.ControllerKey,
): InputFilter => assocPath(['inputMap', inputKey], controllerKey, filter);

export const getInputFilterFields = (
  kind: InputFilterKind,
): InputFilterField[] => inputFilterFields[kind];

export const defaultInputFilter = (
  kind: InputFilterKind,
  oldFilter?: InputFilter,
): InputFilter => ({
  kind,
  inputMap: {},
  state:
    oldFilter && inputFilterClasses[kind] === inputFilterClasses[oldFilter.kind]
      ? oldFilter.state
      : { ...defaultInputFilterStates[kind] },
});

export const validateFilter = (o: any): boolean =>
  typeof o === 'object' &&
  inputFilterKinds.includes(o.kind) &&
  typeof o.state === 'object' &&
  typeof o.inputMap === 'object';

export const stringToFilter: (
  str: string,
) => Maybe<InputFilter> = validateJSONString(validateFilter);

export const filterToString = (filter: InputFilter): string =>
  JSON.stringify(filter);
