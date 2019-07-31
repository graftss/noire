import Konva from 'konva';
import * as T from '../../types';
import { deserializeTexture } from '../texture/';
import { deserializeInputFilter } from '../filter';
import { assoc, mapObj } from '../../utils';
import {
  ButtonComponent,
  buttonEditorConfig,
  buttonInputKinds,
} from './ButtonComponent';
import {
  DPadComponent,
  dPadEditorConfig,
  dPadInputKinds,
} from './DPadComponent';
import {
  StaticComponent,
  staticEditorConfig,
  staticInputKinds,
} from './StaticComponent';
import {
  StickComponent,
  stickEditorConfig,
  stickInputKinds,
} from './StickComponent';
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
  name: string;
  kind: K;
  graphics: SerializedComponentGraphics<SS, TS>;
  state?: Partial<S> & T.TypedComponentState<I>;
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

export type ComponentEditorField =
  | { kind: 'fixed'; data: { label: string } }
  | {
      kind: 'slider';
      data: { key: string; label: string; max: number; min: number };
    }
  | {
      kind: 'keys';
      data: { keys: ComponentKey[] };
    };

export type ComponentEditorConfig = ComponentEditorField[];

export const componentEditorConfigs: Record<
  ComponentKind,
  ComponentEditorConfig
> = {
  button: buttonEditorConfig,
  stick: stickEditorConfig,
  dpad: dPadEditorConfig,
  static: staticEditorConfig,
};

export const componentInputKinds: Record<ComponentKind, Dict<T.InputKind>> = {
  button: buttonInputKinds,
  stick: stickInputKinds,
  dpad: dPadInputKinds,
  static: staticInputKinds,
};

export const stringifyComponentKey = ({
  label,
  inputKind,
}: ComponentKey): string => `${label} (${inputKind})`;

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const deserializeComponentFilterDict = (
  filters: Dict<SerializedComponentFilter<T.InputFilterKind>[]>,
): T.ComponentFilterDict<string> =>
  mapObj(filters, shapeFilters => shapeFilters.map(deserializeComponentFilter));

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

export const updateComponentKey = (
  state: T.ComponentState,
  update: T.ComponentKeyUpdate,
): typeof state => {
  const { controllerId, bindingsKey, inputKey } = update;

  const controllerKey: Maybe<T.ControllerKey> =
    controllerId !== undefined && bindingsKey !== undefined
      ? { controllerId, key: bindingsKey }
      : undefined;

  return {
    ...state,
    inputMap: assoc(state.inputMap || {}, inputKey, controllerKey),
  };
};
