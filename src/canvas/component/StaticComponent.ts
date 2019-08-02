import * as T from '../../types';
import { Component } from './Component';

const staticShapes = ['shape'] as const;
type StaticShapes = typeof staticShapes[number];

const staticTextures = ['texture'] as const;
type StaticTextures = typeof staticTextures[number];

export type StaticGraphics = T.ComponentGraphics<StaticShapes, StaticTextures>;

export const staticInputKinds = {};

export type StaticInput = T.KindsToRaw<typeof staticInputKinds>;

const staticKeys: T.ComponentKey[] = [];

export type StaticState = T.ComponentState<typeof staticInputKinds>;

export const defaultStaticState: StaticState = {
  name: 'Static Component',
  inputMap: {},
};

export type SerializedStaticComponent = T.Serialized<
  'static',
  StaticShapes,
  StaticTextures,
  typeof staticInputKinds,
  StaticState
>;

export const staticEditorConfig: T.ComponentEditorConfig = {
  title: 'Static',
  keys: staticKeys,
  shapes: staticShapes,
  textures: staticTextures,
};

export class StaticComponent extends Component<
  StaticShapes,
  StaticTextures,
  typeof staticInputKinds,
  StaticState
> {
  constructor(
    id: string,
    graphics: StaticGraphics,
    state: Partial<StaticState>,
    filters: T.ComponentFilterDict<StaticShapes>,
  ) {
    super(
      id,
      graphics,
      staticInputKinds,
      {
        ...defaultStaticState,
        ...state,
      },
      filters,
    );
  }

  update(): void {
    const {
      textures: { texture },
      shapes: { shape },
    } = this.graphics;

    if (texture && shape) texture.apply(shape);
  }
}
