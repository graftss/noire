import Konva from 'konva';
import * as T from '../../types';
import { uuid } from '../../utils';
import { deserializeTexture } from '../texture/';
import {
  ButtonComponent,
  buttonEditorConfig,
  newSerializedButton,
  ButtonComponentGraphics,
} from './ButtonComponent';
import {
  DPadComponent,
  dPadEditorConfig,
  newSerializedDPad,
} from './DPadComponent';
import {
  StickComponent,
  stickEditorConfig,
  StickGraphics,
  newSerializedStick,
} from './StickComponent';
import { Component } from './Component';

export interface BaseSerializedComponent<K, S, I extends Dict<T.Input>> {
  id: string;
  name: string;
  kind: K;
  graphics: SerializedComponentGraphics;
  inputKinds: T.InputKindProjection<I>;
  state: Partial<S> & T.BaseComponentState<I>;
}

export type SerializedComponent =
  | T.SerializedButtonComponent
  | T.SerializedStickComponent
  | T.SerializedDPadComponent;

export type ComponentKind = SerializedComponent['kind'];

export interface ComponentKey {
  key: string;
  label: string;
  inputKind: T.InputKind;
}

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
};

export const stringifyComponentKey = ({
  label,
  inputKind,
}: ComponentKey): string => `${label} (${inputKind})`;

export function newSerializedComponent(
  kind: 'button',
): T.SerializedButtonComponent;
export function newSerializedComponent(kind: 'dpad'): T.SerializedDPadComponent;
export function newSerializedComponent(
  kind: 'stick',
): T.SerializedStickComponent;
export function newSerializedComponent(
  kind: T.ComponentKind,
): T.SerializedComponent;
export function newSerializedComponent(
  kind: T.ComponentKind,
): T.SerializedComponent {
  const id = uuid();

  switch (kind) {
    case 'button':
      return newSerializedButton(id);
    case 'dpad':
      return newSerializedDPad(id);
    case 'stick':
      return newSerializedStick(id);
  }
}

export interface SerializedComponentGraphics {
  shapes: Record<string, object>;
  textures: Record<string, T.SerializedTexture>;
}

export const serializeGraphics = (
  graphics: T.ComponentGraphics,
): SerializedComponentGraphics => {
  const result: SerializedComponentGraphics = { shapes: {}, textures: {} };
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

export const deserializeGraphics = (
  serialized: SerializedComponentGraphics,
): T.ComponentGraphics => {
  const result: T.ComponentGraphics = { shapes: {}, textures: {} };
  const { shapes, textures } = serialized;

  for (const k in shapes) {
    result.shapes[k] = Konva.Node.create(shapes[k], undefined) as Konva.Shape;
  }

  for (const k in textures) {
    result.textures[k] = deserializeTexture(textures[k]);
  }

  return result;
};

export const deserializeComponent = (s: T.SerializedComponent): Component => {
  const graphics = deserializeGraphics(s.graphics);

  switch (s.kind) {
    case 'button':
      return new ButtonComponent(
        s.id,
        graphics as ButtonComponentGraphics,
        s.state,
      );
    case 'stick':
      return new StickComponent(s.id, graphics as StickGraphics, s.state);
    case 'dpad':
      return new DPadComponent(s.id, graphics, s.state);
  }
};
