import Konva from 'konva';
import * as T from '../types';
import { find, mapObj, mapPath } from '../utils';
import { buttonEditorConfig } from './component/ButtonComponent';
import { stickEditorConfig } from './component/StickComponent';
import { dPadEditorConfig } from './component/DPadComponent';
import { staticEditorConfig } from './component/StaticComponent';

export type EditorFieldKind = 'string' | 'boolean' | 'Vec2' | 'number';

export type EditorField = { label: string; props?: object } & (
  | { kind: 'string'; defaultValue?: string }
  | { kind: 'boolean'; defaultValue?: boolean }
  | { kind: 'number'; defaultValue?: number; props?: { precision?: number } }
  | { kind: 'Vec2'; defaultValue?: Vec2; props?: { precision?: number } });

export type StateEditorField = EditorField & {
  key: string;
};

export interface ComponentEditorConfig {
  title: string;
  state?: StateEditorField[];
  keys: T.ComponentKey[];
  models: readonly string[];
  textures: readonly string[];
}

const baseStateEditorFields: StateEditorField[] = [
  { label: 'Name', kind: 'string', key: 'name' },
  {
    label: 'offset x',
    kind: 'Vec2',
    key: 'offset',
    props: { precision: 1 },
  },
  { label: 'Scale', kind: 'Vec2', key: 'scale', props: { precision: 2 } },
];

const baseComponentEditorConfigs: Record<
  T.ComponentKind,
  ComponentEditorConfig
> = {
  button: buttonEditorConfig,
  stick: stickEditorConfig,
  dpad: dPadEditorConfig,
  static: staticEditorConfig,
};

const componentEditorConfigs = mapObj(
  config => ({
    ...config,
    state: baseStateEditorFields.concat(config.state || []),
  }),
  baseComponentEditorConfigs,
);

export type KonvaModelKind = 'Rect' | 'Circle';

export type ModelEditorField<V = any> = EditorField & {
  defaultValue: V;
  key: string;
  getter: (model: Konva.Shape) => V;
  serialGetter: (model: T.SerializedKonvaModel) => V;
  setter: (model: Konva.Shape, value: V) => Konva.Shape;
  serialSetter: (
    model: T.SerializedKonvaModel,
    value: V,
  ) => T.SerializedKonvaModel;
};

export interface KonvaModelConfig {
  label: string;
  className: string;
  fields: ModelEditorField[];
}

const baseModelFields: ModelEditorField[] = [
  {
    label: 'x offset',
    kind: 'number',
    key: 'x',
    defaultValue: 0,
    props: { precision: 1 },
    getter: (model: Konva.Shape) => model.offsetX(),
    serialGetter: (model: T.SerializedKonvaModel) => model.attrs.x,
    setter: (model: Konva.Shape, x: number) => model.x(x),
    serialSetter: (model: T.SerializedKonvaModel, x: number) =>
      mapPath(['attrs', 'x'], () => x, model),
  } as ModelEditorField<number>,
  {
    label: 'y offset',
    kind: 'number',
    key: 'y',
    defaultValue: 0,
    props: { precision: 1 },
    getter: (model: Konva.Shape) => model.offsetY(),
    serialGetter: (model: T.SerializedKonvaModel) => model.attrs.y,
    setter: (model: Konva.Shape, y: number) => model.y(y),
    serialSetter: (model: T.SerializedKonvaModel, y: number) =>
      mapPath(['attrs', 'y'], () => y, model),
  } as ModelEditorField<number>,
];

const baseKonvaModelConfigs: Record<T.KonvaModelKind, KonvaModelConfig> = {
  Rect: {
    label: 'Rectangle',
    className: 'Rect',
    fields: [],
  },

  Circle: {
    label: 'Circle',
    className: 'Circle',
    fields: [],
  },
};

const konvaModelConfigs = mapObj(
  config => ({ ...config, fields: baseModelFields.concat(config.fields) }),
  baseKonvaModelConfigs,
);

export const getKonvaModelConfig = (kind: KonvaModelKind): KonvaModelConfig =>
  konvaModelConfigs[kind];

export const getComponentEditorConfig = (
  kind: T.ComponentKind,
): ComponentEditorConfig => componentEditorConfigs[kind];

const findFieldByKey = (
  className: KonvaModelKind,
  key: string,
): Maybe<ModelEditorField> =>
  find(field => field.key === key, konvaModelConfigs[className].fields);

export const updateSerializedModel = <V>(
  model: T.SerializedKonvaModel,
  key: string,
  value: V,
): typeof model => {
  const field = findFieldByKey(model.className, key);
  return field ? field.serialSetter(model, value) : model;
};

export const updateKonvaModel = <V>(
  model: Konva.Shape,
  key: string,
  value: V,
): typeof model => {
  const field = findFieldByKey(model.className as KonvaModelKind, key);
  return field ? field.setter(model, value) : model;
};
