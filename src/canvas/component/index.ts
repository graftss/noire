import Konva from 'konva';
import * as T from '../../types';
import { buttonEditorConfig, ButtonComponentInput } from './ButtonComponent';
import { dPadEditorConfig } from './DPadComponent';
import { stickEditorConfig } from './StickComponent';

interface Serialized<K, S, I extends Record<string, T.Input>> {
  id: string;
  kind: K;
  state: Partial<S>;
  inputKinds: T.InputKindProjection<I>;
}

export type SerializedComponent =
  | Serialized<'button', T.ButtonState, T.ButtonComponentInput>
  | Serialized<'stick', T.StickState, T.StickInput>
  | Serialized<'dpad', T.DPadState, T.DPadInput>;

export type ComponentKind = SerializedComponent['kind'];

export interface ComponentBinding {
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
      kind: 'bindings';
      data: { bindings: ComponentBinding[] };
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
