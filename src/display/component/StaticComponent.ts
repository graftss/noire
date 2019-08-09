import * as T from '../../types';
import { Component } from './Component';

const staticModels = ['model'] as const;
type StaticModels = typeof staticModels[number];

const staticTextures = ['texture'] as const;
type StaticTextures = typeof staticTextures[number];

export const staticInputKinds = {};

export type StaticInput = T.KindsToRaw<typeof staticInputKinds>;

const staticKeys: T.ComponentKey[] = [];

export type StaticState = T.ComponentState<typeof staticInputKinds>;

export const defaultState: StaticState = {
  name: 'Static Component',
};

export type SerializedStaticComponent = T.SerializedComponent<
  'static',
  StaticModels,
  StaticTextures,
  typeof staticInputKinds,
  StaticState
>;

export const staticEditorConfig: T.ComponentEditorConfig = {
  title: 'Static',
  keys: staticKeys,
  models: staticModels,
  textures: staticTextures,
};

export class StaticComponent extends Component<
  StaticModels,
  StaticTextures,
  typeof staticInputKinds,
  StaticState
> {
  constructor(
    id: string,
    graphics: T.ComponentGraphics<StaticModels, StaticTextures>,
    state: Partial<StaticState>,
    filters: T.ComponentFilterDict<StaticModels>,
  ) {
    super(
      id,
      graphics,
      staticInputKinds,
      { ...defaultState, ...state, },
      filters,
    );
  }

  update(): void {
    const {
      textures: { texture },
      models: { model },
    } = this.graphics;

    if (texture && model) texture.apply(model);
  }
}
