import Konva from 'konva';
import * as T from '../../types';
import { uuid } from '../../utils';
import { buttonEditorConfig, newSerializedButton } from './ButtonComponent';
import { dPadEditorConfig, newSerializedDPad } from './DPadComponent';
import { stickEditorConfig, newSerializedStick } from './StickComponent';

export interface Serialized<K, S, I extends Dict<T.Input>> {
  id: string;
  name: string;
  kind: K;
  state: Partial<S> & T.BaseComponentState<I>;
  inputKinds: T.InputKindProjection<I>;
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
