import * as T from '../../types';
import { Component } from './Component';

const inputKinds = {} as const;

export const staticComponentData: T.ComponentData<typeof inputKinds> = {
  models: ['model'] as const,
  textures: ['texture'] as const,
  inputKinds,
};

type StaticModels = typeof staticComponentData.models[number];
type StaticTextures = typeof staticComponentData.textures[number];
type StaticInput = typeof staticComponentData.inputKinds;
export type StaticState = T.ComponentState<StaticInput>;

export const defaultState: StaticState = {
  name: 'Static Component',
};

const staticKeys: T.ComponentKey[] = [];

export type SerializedStaticComponent = T.SerializedComponent<
  'static',
  StaticModels,
  StaticTextures,
  StaticInput,
  StaticState
>;

export const staticEditorConfig: T.ComponentEditorConfig = {
  title: 'Static',
  keys: staticKeys,
  models: staticComponentData.models,
  textures: staticComponentData.textures,
};

export class StaticComponent extends Component<
  StaticModels,
  StaticTextures,
  StaticInput,
  StaticState
> {
  constructor(
    id: string,
    graphics: T.ComponentGraphics<StaticModels, StaticTextures>,
    state: Partial<StaticState>,
    filters: T.ComponentFilters<StaticModels>,
  ) {
    super(
      id,
      graphics,
      staticComponentData.inputKinds,
      { ...defaultState, ...state },
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
