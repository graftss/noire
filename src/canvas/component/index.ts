import Konva from 'konva';
import * as T from '../../types';
import { deserializeTexture } from '../texture/';
import {
  ButtonComponent,
  buttonEditorConfig,
  ButtonComponentGraphics,
} from './ButtonComponent';
import { DPadComponent, DPadGraphics, dPadEditorConfig } from './DPadComponent';
import {
  StaticComponent,
  StaticGraphics,
  staticEditorConfig,
} from './StaticComponent';
import {
  StickComponent,
  stickEditorConfig,
  StickGraphics,
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
  inputKinds: T.InputKindProjection<I>;
  state: Partial<S> & T.BaseComponentState<I>;
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

export const deserializeComponent = (s: T.SerializedComponent): Component => {
  switch (s.kind) {
    case 'button':
      return new ButtonComponent(
        s.id,
        deserializeGraphics(s.graphics) as ButtonComponentGraphics,
        s.state,
      );
    case 'stick':
      return new StickComponent(
        s.id,
        deserializeGraphics(s.graphics) as StickGraphics,
        s.state,
      );
    case 'dpad':
      return new DPadComponent(
        s.id,
        deserializeGraphics(s.graphics) as DPadGraphics,
        s.state,
      );
    case 'static':
      return new StaticComponent(
        s.id,
        deserializeGraphics(s.graphics) as StaticGraphics,
        s.state,
      );
  }
};
