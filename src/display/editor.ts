import Konva from 'konva';
import * as T from '../types';
import { buttonEditorConfig } from './component/ButtonComponent';
import { stickEditorConfig } from './component/StickComponent';
import { dPadEditorConfig } from './component/DPadComponent';
import { staticEditorConfig } from './component/StaticComponent';

export type EditorFieldKind = 'string' | 'boolean' | 'Vec2' | 'number';

export type EditorField = { label: string } & (
  | { kind: 'string'; defaultValue?: string }
  | { kind: 'boolean'; defaultValue?: boolean }
  | { kind: 'number'; defaultValue?: number; precision?: number }
  | { kind: 'Vec2'; defaultValue?: Vec2; precision?: number });

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
    precision: 1,
  },
  { label: 'Scale', kind: 'Vec2', key: 'scale', precision: 2 },
];

const componentEditorConfigs: Record<T.ComponentKind, ComponentEditorConfig> = {
  button: buttonEditorConfig,
  stick: stickEditorConfig,
  dpad: dPadEditorConfig,
  static: staticEditorConfig,
};

export type KonvaShapeKind = 'Rect' | 'Circle';

export type ShapeEditorField = EditorField & {
  setter: (shape: Konva.Shape, ...args: any) => void;
};

export interface KonvaShapeConfig {
  label: string;
  className: string;
  fields?: ShapeEditorField[];
}

const baseShapeFields: ShapeEditorField[] = [
  {
    label: 'x offset',
    kind: 'number',
    defaultValue: 0,
    setter: (shape: Konva.Shape, x: number) => shape.offsetX(x),
  },
  {
    label: 'y offset',
    kind: 'number',
    defaultValue: 0,
    setter: (shape: Konva.Shape, y: number) => shape.offsetY(y),
  },
];

const konvaShapeConfigs: Record<T.KonvaShapeKind, KonvaShapeConfig> = {
  Rect: {
    label: 'Rectangle',
    className: 'Rect',
    fields: [],
  },

  Circle: {
    label: 'Circle',
    className: 'Circle',
  },
};

export const getKonvaShapeConfig = (kind: KonvaShapeKind): KonvaShapeConfig => {
  const config = konvaShapeConfigs[kind];
  return { ...config, fields: baseShapeFields.concat(config.fields || []) };
};

export const getComponentEditorConfig = (
  kind: T.ComponentKind,
): ComponentEditorConfig => {
  const config = componentEditorConfigs[kind];

  return {
    ...config,
    state: baseStateEditorFields.concat(config.state || []),
  };
};
