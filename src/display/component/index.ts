import * as T from '../../types';
import { deserializeTexture, serializeTexture } from '../texture/';
import {
  deserializeInputFilter,
  getFilterInputKind,
  defaultInputFilter,
} from '../filter';
import { assoc, mapObj, mapPath } from '../../utils';
import { serializeKonvaModel, deserializeKonvaModel } from '../model/konva';
import { Texture } from '../texture/Texture';
import { ButtonComponent, buttonComponentData } from './ButtonComponent';
import { DPadComponent, dPadComponentData } from './DPadComponent';
import { StaticComponent, staticComponentData } from './StaticComponent';
import { StickComponent, stickComponentData } from './StickComponent';
import { Component } from './Component';

export interface ComponentData<I = any> {
  models: readonly string[];
  textures: readonly string[];
  inputKinds: I;
}

export interface SerializedComponentStateData {
  button: T.SerializedButtonComponent['state'];
  stick: T.SerializedStickComponent['state'];
  dPad: T.SerializedDPadComponent['state'];
  static: T.SerializedStaticComponent['state'];
}

export type ComponentKind = keyof SerializedComponentStateData;

// K: identifying kind of component
// SS: model keys
// TS: texture keys
// I: component input
// S: component state
export interface SerializedComponent<
  K extends ComponentKind = ComponentKind,
  SS extends string = string,
  TS extends string = string,
  I extends Dict<T.InputKind> = {},
  S extends SerializedComponentStateData[K] = SerializedComponentStateData[K]
> {
  id: string;
  kind: K;
  graphics: SerializedComponentGraphics<SS, TS>;
  state: S;
  filters: Record<SS, SerializedComponentFilter<T.InputFilterKind>[]>;
}

const componentData = {
  button: buttonComponentData,
  dPad: dPadComponentData,
  static: staticComponentData,
  stick: stickComponentData,
} as const;

export interface ComponentKey {
  key: string;
  label: string;
  inputKind: T.InputKind;
}

export const mappedControllerKey = (
  component: SerializedComponent,
  componentKey: ComponentKey,
): Maybe<T.ControllerKey> =>
  component.state &&
  component.state.inputMap &&
  component.state.inputMap[componentKey.key];

export const getComponentKeyInputKind = (
  component: SerializedComponent,
  componentKey: ComponentKey,
): T.InputKind => componentData[component.kind].inputKinds[componentKey.key];

export const getComponentModelList = (kind: ComponentKind): readonly string[] =>
  componentData[kind].models;

export const getComponentTextureList = (
  kind: ComponentKind,
): readonly string[] => componentData[kind].textures;

export const stringifyComponentKey = ({
  label,
  inputKind,
}: ComponentKey): string => `${label} (${inputKind})`;

export interface ComponentKeyUpdate {
  componentId: string;
  inputKey: string;
  controllerKey?: T.ControllerKey;
}

export const updateComponentKey = (
  state: T.ComponentState,
  update: ComponentKeyUpdate,
): typeof state => {
  const { controllerKey, inputKey } = update;

  return {
    ...state,
    inputMap: assoc(state.inputMap || {}, inputKey, controllerKey),
  };
};

export interface SerializedComponentGraphics<
  SS extends string,
  TS extends string
> {
  models: Record<SS, T.SerializedKonvaModel>;
  textures: Record<TS, T.SerializedTexture>;
}

export const serializeGraphics = <SS extends string, TS extends string>(
  graphics: T.ComponentGraphics<SS, TS>,
): SerializedComponentGraphics<SS, TS> => {
  const result: any = { models: {}, textures: {} };
  const { models, textures } = graphics;

  for (const k in models) {
    if (models[k]) {
      result.models[k] = serializeKonvaModel(models[k] as T.KonvaModel);
    }
  }

  for (const k in textures) {
    const texture = textures[k];
    if (texture) result.textures[k] = serializeTexture(texture as Texture);
  }

  return result;
};

export const deserializeGraphics = <SS extends string, TS extends string>(
  serialized: SerializedComponentGraphics<SS, TS>,
): T.ComponentGraphics<SS, TS> => {
  const result: any = { models: {}, textures: {} };
  const { models, textures } = serialized;

  for (const k in models) {
    result.models[k] = deserializeKonvaModel(models[k]);
  }

  for (const k in textures) {
    result.textures[k] = deserializeTexture(textures[k]);
  }

  return result;
};

export interface SerializedComponentFilter<
  K extends T.InputFilterKind = T.InputFilterKind
> {
  filter: T.SerializedInputFilter<K>;
  inputMap: Dict<T.ControllerKey>;
}

export interface ComponentFilterKey {
  model: string;
  filterIndex: number;
  filterKey: string;
}

export type SerializedComponentFilterDict = Dict<
  SerializedComponentFilter<T.InputFilterKind>[]
>;

export const getFilterInDict = (
  filterDict: SerializedComponentFilterDict,
  modelName: string,
  filterIndex: number,
): Maybe<SerializedComponentFilter> =>
  filterDict[modelName] && filterDict[modelName][filterIndex];

export const mapFilterInDict = (
  filterDict: SerializedComponentFilterDict,
  modelName: string,
  filterIndex: number,
  map: (f: SerializedComponentFilter) => SerializedComponentFilter,
): SerializedComponentFilterDict =>
  mapPath([modelName, filterIndex], map, filterDict);

export const defaultSerializedComponentFilter = (
  kind: T.InputFilterKind,
  oldFilter?: SerializedComponentFilter,
): SerializedComponentFilter => ({
  filter: defaultInputFilter(kind, oldFilter && oldFilter.filter),
  inputMap: {},
});

export const getComponentFilterControllerKey = (
  component: SerializedComponent,
  { model, filterIndex, filterKey }: ComponentFilterKey,
): Maybe<T.ControllerKey> =>
  component.filters &&
  component.filters[model] &&
  component.filters[model][filterIndex] &&
  component.filters[model][filterIndex].inputMap &&
  component.filters[model][filterIndex].inputMap[filterKey];

export const getComponentFilterInputKind = (
  component: T.SerializedComponent,
  { model, filterIndex, filterKey }: ComponentFilterKey,
): Maybe<T.InputKind> =>
  component.filters !== undefined
    ? getFilterInputKind(
        component.filters[model][filterIndex].filter,
        filterKey,
      )
    : undefined;

export const deserializeComponentFilter = ({
  filter,
  inputMap,
}: SerializedComponentFilter<T.InputFilterKind>): T.ComponentFilter<
  T.InputFilterKind
> => ({
  kind: filter.kind,
  filter: deserializeInputFilter(filter),
  inputMap,
  state: filter.state,
});

export const deserializeComponentFilterDict = (
  filters: SerializedComponentFilterDict,
): T.ComponentFilterDict =>
  mapObj(modelFilters => modelFilters.map(deserializeComponentFilter), filters);

export interface ComponentFilterKeyUpdate {
  componentId: string;
  componentFilterKey: ComponentFilterKey;
  controllerKey?: T.ControllerKey;
}

export const updateComponentFilterState = (
  filters: SerializedComponentFilter,
  stateKey: string,
  value: any,
): SerializedComponentFilter =>
  mapPath(['filter', 'state', stateKey], () => value, filters);

export const updateComponentFilterKey = (
  filterDict: SerializedComponentFilterDict,
  update: ComponentFilterKeyUpdate,
): SerializedComponentFilterDict => {
  const {
    controllerKey,
    componentFilterKey: { model, filterIndex, filterKey },
  } = update;

  return mapPath(
    [model, filterIndex, 'inputMap', filterKey],
    () => controllerKey,
    filterDict,
  );
};

export const deserializeComponent = (s: T.SerializedComponent): Component => {
  let ComponentConstructor: any;

  switch (s.kind) {
    case 'button':
      ComponentConstructor = ButtonComponent;
      break;
    case 'stick':
      ComponentConstructor = StickComponent;
      break;
    case 'dPad':
      ComponentConstructor = DPadComponent;
      break;
    case 'static':
      ComponentConstructor = StaticComponent;
      break;
  }

  return new ComponentConstructor(
    s.id,
    deserializeGraphics(s.graphics as any),
    s.state,
    s.filters && deserializeComponentFilterDict(s.filters),
    s.filters && deserializeComponentFilterDict(s.filters),
  );
};
