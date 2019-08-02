import Konva from 'konva';
import * as T from '../../types';
import { deserializeTexture } from '../texture/';
import { deserializeInputFilter, getFilterInputKind } from '../filter';
import { assoc, mapObj, mapPath } from '../../utils';
import { ButtonComponent, buttonInputKinds } from './ButtonComponent';
import { DPadComponent, dPadInputKinds } from './DPadComponent';
import { StaticComponent, staticInputKinds } from './StaticComponent';
import { StickComponent, stickInputKinds } from './StickComponent';
import { Component } from './Component';

// K: identifying kind of component
// SS: shape keys
// TS: texture keys
// S: component state
// I: component input
export interface BaseSerializedComponent<
  K,
  SS extends string,
  TS extends string,
  S,
  I extends Dict<T.Input>
> {
  id: string;
  kind: K;
  graphics: SerializedComponentGraphics<SS, TS>;
  state: Partial<S> & T.TypedComponentState<I>;
  filters?: Record<SS, SerializedComponentFilter<T.InputFilterKind>[]>;
}

export type SerializedComponent =
  | T.SerializedButtonComponent
  | T.SerializedStickComponent
  | T.SerializedDPadComponent
  | T.SerializedStaticComponent;

export type ComponentKind = SerializedComponent['kind'];

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

const componentInputKinds: Record<ComponentKind, Dict<T.InputKind>> = {
  button: buttonInputKinds,
  stick: stickInputKinds,
  dpad: dPadInputKinds,
  static: staticInputKinds,
};

export const getComponentKeyInputKind = (
  component: SerializedComponent,
  componentKey: ComponentKey,
): T.InputKind => componentInputKinds[component.kind][componentKey.key];

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
  shapes: Record<SS, object>;
  textures: Record<TS, T.SerializedTexture>;
}

export const serializeGraphics = <SS extends string, TS extends string>(
  graphics: T.ComponentGraphics<SS, TS>,
): SerializedComponentGraphics<SS, TS> => {
  const result: any = { shapes: {}, textures: {} };
  const { shapes, textures } = graphics;

  for (const k in shapes) {
    const shape = shapes[k];
    if (shape) result.shapes[k] = JSON.parse(shape.toJSON());
  }

  for (const k in textures) {
    const texture = textures[k];
    if (texture) result.textures[k] = texture.serialize();
  }

  return result;
};

export const deserializeGraphics = <SS extends string, TS extends string>(
  serialized: SerializedComponentGraphics<SS, TS>,
): T.ComponentGraphics<SS, TS> => {
  const result: any = { shapes: {}, textures: {} };
  const { shapes, textures } = serialized;

  for (const k in shapes) {
    result.shapes[k] = Konva.Node.create(shapes[k], undefined) as Konva.Shape;
  }

  for (const k in textures) {
    result.textures[k] = deserializeTexture(textures[k]);
  }

  return result;
};

export interface SerializedComponentFilter<K extends T.InputFilterKind> {
  filter: T.SerializedInputFilter<K>;
  inputMap: Dict<T.ControllerKey>;
}

export interface ComponentFilterKey {
  shape: string;
  filterIndex: number;
  filterKey: string;
}

export type SerializedComponentFilterDict = Dict<
  SerializedComponentFilter<T.InputFilterKind>[]
>;

export const getComponentFilterInputKind = (
  component: T.SerializedComponent,
  { shape, filterIndex, filterKey }: ComponentFilterKey,
): Maybe<T.InputKind> =>
  component.filters !== undefined
    ? getFilterInputKind(
        component.filters[shape][filterIndex].filter,
        filterKey,
      )
    : undefined;

const deserializeComponentFilter = ({
  filter,
  inputMap,
}: SerializedComponentFilter<T.InputFilterKind>): T.ComponentFilter<
  T.InputFilterKind
> => ({
  filter: deserializeInputFilter(filter),
  inputMap,
  config: filter.config,
});

export const deserializeComponentFilterDict = (
  filters: SerializedComponentFilterDict,
): T.ComponentFilterDict =>
  mapObj(filters, shapeFilters => shapeFilters.map(deserializeComponentFilter));

export interface ComponentFilterKeyUpdate {
  componentId: string;
  componentFilterKey: T.ComponentFilterKey;
  controllerKey?: T.ControllerKey;
}

export const updateComponentFilterKey = (
  filterDict: SerializedComponentFilterDict,
  update: ComponentFilterKeyUpdate,
): SerializedComponentFilterDict => {
  const {
    controllerKey,
    componentFilterKey: { shape, filterIndex, filterKey },
  } = update;

  return mapPath(
    [shape, filterIndex, 'inputMap', filterKey],
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
    case 'dpad':
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
