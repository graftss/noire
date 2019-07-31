import * as T from '../../types';
import { TypedComponent } from './Component';

type StaticShapes = 'shape';
type StaticTextures = 'texture';

export type StaticGraphics = T.ComponentGraphics<StaticShapes, StaticTextures>;

export type StaticInput = Record<string, T.Input> & {};

export type SerializedStaticComponent = T.Serialized<
  'static',
  StaticShapes,
  StaticTextures,
  StaticState,
  StaticInput
>;

export const staticInputKinds: T.InputKindProjection<StaticInput> = {};

export type StaticState = T.TypedComponentState<StaticInput>;

export const defaultStaticState: StaticState = {
  inputMap: {},
};

export const staticEditorConfig: T.ComponentEditorConfig = [
  { kind: 'fixed', data: { label: 'Static Image' } },
];

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
