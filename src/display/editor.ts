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
  shapes: readonly string[];
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

export type KonvaShapeKind = 'Rect' | 'Circle';

export type ShapeEditorField<V = any> = EditorField & {
  defaultValue: V;
  key: string;
  getter: (shape: Konva.Shape) => V;
  serialGetter: (shape: T.SerializedKonvaShape) => V;
  setter: (shape: Konva.Shape, value: V) => Konva.Shape;
  serialSetter: (
    shape: T.SerializedKonvaShape,
    value: V,
  ) => T.SerializedKonvaShape;
};

export interface KonvaShapeConfig {
  label: string;
  className: string;
  fields: ShapeEditorField[];
}

const baseShapeFields: ShapeEditorField[] = [
  {
    label: 'x offset',
    kind: 'number',
    key: 'x',
    defaultValue: 0,
    props: { precision: 1 },
    getter: (shape: Konva.Shape) => shape.offsetX(),
    serialGetter: (shape: T.SerializedKonvaShape) => shape.attrs.x,
    setter: (shape: Konva.Shape, x: number) => shape.offsetX(x),
    serialSetter: (shape: T.SerializedKonvaShape, x: number) =>
      mapPath(['attrs', 'x'], () => x, shape),
  } as ShapeEditorField<number>,
  {
    label: 'y offset',
    kind: 'number',
    defaultValue: 0,
    props: { precision: 1 },
    getter: (shape: Konva.Shape) => shape.offsetY(),
    serialGetter: (shape: T.SerializedKonvaShape) => shape.attrs.y,
    setter: (shape: Konva.Shape, y: number) => shape.offsetY(y),
    serialSetter: (shape: T.SerializedKonvaShape, y: number) =>
      mapPath(['attrs', 'y'], () => y, shape),
  } as ShapeEditorField<number>,
];

const baseKonvaShapeConfigs: Record<T.KonvaShapeKind, KonvaShapeConfig> = {
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

const konvaShapeConfigs = mapObj(
  config => ({ ...config, fields: baseShapeFields.concat(config.fields) }),
  baseKonvaShapeConfigs,
);

export const getKonvaShapeConfig = (kind: KonvaShapeKind): KonvaShapeConfig =>
  konvaShapeConfigs[kind];

export const getComponentEditorConfig = (
  kind: T.ComponentKind,
): ComponentEditorConfig => componentEditorConfigs[kind];

const findFieldByKey = (
  className: KonvaShapeKind,
  key: string,
): Maybe<ShapeEditorField> =>
  find(field => field.key === key, konvaShapeConfigs[className].fields);

export const updateSerializedShape = <V>(
  shape: T.SerializedKonvaShape,
  key: string,
  value: V,
): typeof shape => {
  const field = findFieldByKey(shape.className, key);
  return field ? field.serialSetter(shape, value) : shape;
};

export const updateShape = <V>(
  shape: Konva.Shape,
  key: string,
  value: V,
): typeof shape => {
  const field = findFieldByKey(shape.className as KonvaShapeKind, key);
  return field ? field.setter(shape, value) : shape;
};
