import * as T from '../../types';
import { TypedComponent } from './Component';

const staticShapes = ['shape'] as const;
type StaticShapes = typeof staticShapes[number];

const staticTextures = ['texture'] as const;
type StaticTextures = typeof staticTextures[number];

export type StaticGraphics = T.ComponentGraphics<StaticShapes, StaticTextures>;

export type StaticInput = Record<string, T.Input> & {};

export const staticInputKinds: T.InputKindProjection<StaticInput> = {};

const staticKeys: T.ComponentKey[] = [];

export type StaticState = T.TypedComponentState<StaticInput>;

export const defaultStaticState: StaticState = {
  name: 'Static Component',
  inputMap: {},
};

export type SerializedStaticComponent = T.Serialized<
  'static',
  StaticShapes,
  StaticTextures,
  StaticState,
  StaticInput
>;

export const staticEditorConfig: T.ComponentEditorConfig = {
  title: 'Static',
  keys: staticKeys,
  shapes: staticShapes,
  textures: staticTextures,
};

export class StaticComponent extends TypedComponent<
  StaticShapes,
  StaticTextures,
  StaticGraphics,
  StaticInput,
  StaticState
> {
  constructor(
    id: string,
    graphics: StaticGraphics,
    state: Partial<StaticState>,
    filters: T.TypedComponentFilterDict<StaticShapes>,
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
