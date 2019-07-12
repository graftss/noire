import { ButtonComponentConfig, buttonEditorConfig } from './ButtonComponent';
import { DPadComponentConfig, dPadEditorConfig } from './DPadComponent';
import { StickComponentConfig, stickEditorConfig } from './StickComponent';

export type SerializedComponent =
  | ButtonComponentConfig
  | StickComponentConfig
  | DPadComponentConfig;

export type ComponentKind = SerializedComponent['kind'];

export type ComponentEditorField =
  { kind: 'fixed', data: { label: string } }
  | { kind: 'slider', data: { key: string, label: string, max: number, min: number } };

export type ComponentEditorConfig = ComponentEditorField[];

export const componentConfigs: Record<ComponentKind, ComponentEditorConfig> = {
  button: buttonEditorConfig,
  stick: stickEditorConfig,
  dpad: dPadEditorConfig,
};
