import Konva from 'konva';
import * as T from '../../types';
import { buttonEditorConfig, ButtonComponentInput } from './ButtonComponent';
import { dPadEditorConfig } from './DPadComponent';
import { stickEditorConfig } from './StickComponent';

interface Serialized<K, S, I extends Dict<T.Input>> {
  id: string;
  name: string;
  kind: K;
  state: Partial<S> & T.BaseComponentState<I>;
  inputKinds: T.InputKindProjection<I>;
}

export type SerializedComponent =
  | Serialized<'button', T.ButtonState, T.ButtonComponentInput>
  | Serialized<'stick', T.StickState, T.StickInput>
  | Serialized<'dpad', T.DPadState, T.DPadInput>;

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
