import Konva from 'konva';
import * as T from '../../types';
import { TypedComponent } from './Component';

type Dir = 'u' | 'l' | 'd' | 'r';

type DPadShapes = Dir;
type DPadTextures =
  | 'uOn'
  | 'uOff'
  | 'lOn'
  | 'lOff'
  | 'dOn'
  | 'dOff'
  | 'rOn'
  | 'rOff';

export interface DPadGraphics
  extends T.ComponentGraphics<DPadShapes, DPadTextures> {
  shapes: { u: Konva.Shape; l: Konva.Shape; d: Konva.Shape; r: Konva.Shape };
  textures: {
    uOn: T.Texture;
    uOff: T.Texture;
    lOn: T.Texture;
    lOff: T.Texture;
    dOn: T.Texture;
    dOff: T.Texture;
    rOn: T.Texture;
    rOff: T.Texture;
  };
}

export type DPadInput = Record<Dir, T.ButtonInput>;

export const dPadInputKinds: T.InputKindProjection<DPadInput> = {
  u: 'button',
  l: 'button',
  d: 'button',
  r: 'button',
};

export type DPadState = T.BaseComponentState<DPadInput> & {};

export const defaultDPadState: DPadState = {
  inputMap: {},
};

export type SerializedDPadComponent = T.Serialized<
  'dpad',
  DPadShapes,
  DPadTextures,
  DPadState,
  DPadInput
>;

export const dPadEditorConfig: T.ComponentEditorConfig = [
  { kind: 'fixed', data: { label: 'DPad' } },
  {
    kind: 'keys',
    data: {
      keys: [
        { key: 'u', label: 'Up', inputKind: 'button' },
        { key: 'l', label: 'Left', inputKind: 'button' },
        { key: 'd', label: 'Down', inputKind: 'button' },
        { key: 'r', label: 'Right', inputKind: 'button' },
      ],
    },
  },
];

export const simpleDPadRects = (
  x: number,
  y: number,
  width: number,
  height: number,
): DPadGraphics['shapes'] => ({
  u: new Konva.Rect({
    x,
    y: y - height,
    width,
    height,
  }),
  l: new Konva.Rect({
    x: x - width,
    y,
    width,
    height,
  }),
  d: new Konva.Rect({
    x,
    y: y + height,
    width,
    height,
  }),
  r: new Konva.Rect({
    x: x + width,
    y,
    width,
    height,
  }),
});

export const simpleDPadTextures = (
  off: T.SerializedTexture,
  on: T.SerializedTexture,
): Dict<T.SerializedTexture> => ({
  uOn: on,
  uOff: off,
  lOn: on,
  lOff: off,
  dOn: on,
  dOff: off,
  rOn: on,
  rOff: off,
});

export class DPadComponent extends TypedComponent<
  DPadShapes,
  DPadTextures,
  DPadGraphics,
  DPadInput,
  DPadState
> {
  constructor(
    id: string,
    graphics: DPadGraphics,
    state: Partial<DPadState>,
    filters,
  ) {
    super(
      id,
      graphics,
      dPadInputKinds,
      { ...defaultDPadState, ...state },
      filters,
    );
  }

  update(input: DPadInput): void {
    const { u, l, d, r } = this.computeRawInput(input);
    const { shapes, textures } = this.graphics;

    (u ? textures.uOn : textures.uOff).apply(shapes.u);
    (l ? textures.lOn : textures.lOff).apply(shapes.l);
    (d ? textures.dOn : textures.dOff).apply(shapes.d);
    (r ? textures.rOn : textures.rOff).apply(shapes.r);
  }
}
