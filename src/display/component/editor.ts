import * as T from '../../types';
import { buttonEditorConfig } from './ButtonComponent';
import { stickEditorConfig } from './StickComponent';
import { dPadEditorConfig } from './DPadComponent';
import { staticEditorConfig } from './StaticComponent';

export type ComponentEditorField = {
  stateKey: string;
  label: string;
} & (
  | { kind: 'string' | 'boolean' }
  | { kind: 'Vec2' | 'number'; precision?: number });

export interface ComponentEditorConfig {
  title: string;
  state?: ComponentEditorField[];
  keys: T.ComponentKey[];
  shapes: readonly string[];
  textures: readonly string[];
}

const componentEditorConfigs: Record<T.ComponentKind, ComponentEditorConfig> = {
  button: buttonEditorConfig,
  stick: stickEditorConfig,
  dpad: dPadEditorConfig,
  static: staticEditorConfig,
};

const baseEditorFields: ComponentEditorField[] = [
  { label: 'Name', kind: 'string', stateKey: 'name' },
  { label: 'Offset', kind: 'Vec2', stateKey: 'offset', precision: 1 },
  { label: 'Scale', kind: 'Vec2', stateKey: 'scale', precision: 2 },
];

export const getEditorConfig = (
  kind: T.ComponentKind,
): ComponentEditorConfig => {
  const config = componentEditorConfigs[kind];

  return {
    ...config,
    state: baseEditorFields.concat(config.state || []),
  };
};
