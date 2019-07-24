import Konva from 'konva';
import * as T from '../../types';
import { uuid } from '../../utils';
import {
  ButtonComponent,
  buttonEditorConfig,
  newSerializedButton,
} from './ButtonComponent';
import {
  DPadComponent,
  dPadEditorConfig,
  newSerializedDPad,
} from './DPadComponent';
import {
  StickComponent,
  stickEditorConfig,
  newSerializedStick,
} from './StickComponent';
import { Component } from './Component';

export interface BaseSerializedComponent<K, S, I extends Dict<T.Input>> {
  id: string;
  name: string;
  kind: K;
  graphics: object;
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

export interface GroupContainer {
  group: Konva.Group;
}

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deserializeGraphics = (graphics: object): any => graphics;

export const deserializeComponent = (s: T.SerializedComponent): Component => {
  const graphics = deserializeGraphics(s.graphics);

  switch (s.kind) {
    case 'button':
      return new ButtonComponent(s.id, graphics, s.state);
    case 'stick':
      return new StickComponent(s.id, graphics, s.state);
    case 'dpad':
      return new DPadComponent(s.id, graphics, s.state);
  }
};
