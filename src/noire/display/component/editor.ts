import * as T from '../../types';
import { mapObj } from '../../utils';
import { defaultComponentState } from './Component';
import { buttonEditorConfig } from './ButtonComponent';
import { stickEditorConfig } from './StickComponent';
import { dPadEditorConfig } from './DPadComponent';
import { staticEditorConfig } from './StaticComponent';

export interface ComponentStateEditorField<
  K extends T.EditorFieldKind = T.EditorFieldKind,
  C extends T.ComponentKind = T.ComponentKind
> extends T.EditorField<K> {
  getter: (
    c: T.SerializedComponentStateData[C],
  ) => T.EditorFieldData[K]['type'];
  setter: (
    c: T.SerializedComponentStateData[C],
    value: T.EditorFieldData[K]['type'],
  ) => T.SerializedComponentStateData[C];
}

export interface ComponentEditorConfig {
  title: string;
  state?: ComponentStateEditorField[];
  keys: T.ComponentKey[];
  models: readonly string[];
  textures: readonly string[];
}

const baseStateEditorFields: ComponentStateEditorField[] = [
  {
    label: 'Name',
    key: 'name',
    kind: 'string',
    defaultValue: 'Unnamed component',
    props: undefined,
    getter: c => c.name,
    setter: (c, name) => ({ ...c, name }),
  } as ComponentStateEditorField<'string'>,
  {
    label: 'Position',
    kind: 'Vec2',
    key: 'position',
    defaultValue: defaultComponentState.position,
    props: { precision: 1 },
    getter: c => c.position,
    setter: (c, position) => ({ ...c, position }),
  } as ComponentStateEditorField<'Vec2'>,
  {
    label: 'Scale',
    kind: 'Vec2',
    key: 'scale',
    defaultValue: defaultComponentState.scale,
    props: { precision: 2 },
    getter: c => c.scale,
    setter: (c, scale) => ({ ...c, scale }),
  } as ComponentStateEditorField<'Vec2'>,
  {
    label: 'Rotation',
    kind: 'number',
    key: 'rotation',
    defaultValue: defaultComponentState.rotation,
    props: { precision: 2 },
    getter: c => c.rotation,
    setter: (c, rotation) => ({ ...c, rotation }),
  } as ComponentStateEditorField<'number'>,
];

const baseComponentEditorConfigs: Record<
  T.ComponentKind,
  ComponentEditorConfig
> = {
  button: buttonEditorConfig,
  stick: stickEditorConfig,
  dPad: dPadEditorConfig,
  static: staticEditorConfig,
};

const componentEditorConfigs = mapObj(
  config => ({
    ...config,
    state: baseStateEditorFields.concat(config.state || []),
  }),
  baseComponentEditorConfigs,
);

export const getComponentEditorConfig = (
  kind: T.ComponentKind,
): ComponentEditorConfig => componentEditorConfigs[kind];
