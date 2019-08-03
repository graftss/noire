import * as T from '../../types';
import { buttonEditorConfig } from './ButtonComponent';
import { stickEditorConfig } from './StickComponent';
import { dPadEditorConfig } from './DPadComponent';
import { staticEditorConfig } from './StaticComponent';

export interface ComponentEditorField {
  stateKey: string;
  kind: 'string' | 'number' | 'boolean' | 'Vec2';
  label: string;
}

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
  { label: 'Offset', kind: 'Vec2', stateKey: 'offset' },
  { label: 'Scale', kind: 'Vec2', stateKey: 'scale' },
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
