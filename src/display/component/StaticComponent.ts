import * as T from '../../types';
import { Component } from './Component';

const inputKinds = {} as const;

const models = ['model'] as const;

const textures = ['texture'] as const;

const defaultState: StaticState = {
  name: 'Static Component',
};
type StaticModels = typeof models[number];
type StaticTextures = typeof textures[number];
type StaticInput = typeof inputKinds;
export type StaticState = T.ComponentState<StaticInput>;

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
  models,
  textures,
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
    super(id, graphics, inputKinds, { ...defaultState, ...state }, filters);
  }

  update(): void {
    const {
      textures: { texture },
      models: { model },
    } = this.graphics;

    if (texture && model) texture.apply(model);
  }
}

export const staticComponentData: T.ComponentData<typeof inputKinds> = {
  models,
  textures,
  inputKinds,
  defaultState,
};
