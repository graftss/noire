import Konva from 'konva';
import * as T from '../../types';
import { Component } from './Component';

const dirs = ['u', 'l', 'd', 'r'] as const;
type Dir = typeof dirs[number];

const dPadShapes = dirs;
type DPadShapes = Dir;

const dPadTextures = [
  'uOn',
  'uOff',
  'lOn',
  'lOff',
  'dOn',
  'dOff',
  'rOn',
  'rOff',
] as const;
type DPadTextures = typeof dPadTextures[number];

export type DPadGraphics = T.ComponentGraphics<DPadShapes, DPadTextures>;

export const dPadInputKinds = {
  u: 'button',
  l: 'button',
  d: 'button',
  r: 'button',
} as const;

export type DPadInput = T.KindsToRaw<typeof dPadInputKinds>;

const dPadKeys: T.ComponentKey[] = [
  { key: 'u', label: 'Up', inputKind: 'button' },
  { key: 'l', label: 'Left', inputKind: 'button' },
  { key: 'd', label: 'Down', inputKind: 'button' },
  { key: 'r', label: 'Right', inputKind: 'button' },
];

export type DPadState = T.ComponentState<typeof dPadInputKinds>;

export const defaultDPadState: DPadState = {
  name: 'DPad Component',
  inputMap: {},
};

export type SerializedDPadComponent = T.Serialized<
  'dpad',
  DPadShapes,
  DPadTextures,
  typeof dPadInputKinds,
  DPadState
>;

export const dPadEditorConfig: T.ComponentEditorConfig = {
  title: 'D-Pad',
  keys: dPadKeys,
  shapes: dPadShapes,
  textures: dPadTextures,
};

export const simpleDPadRects = (
  x: number,
  y: number,
  width: number,
  height: number,
): Record<DPadShapes, Konva.Rect> => ({
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

export class DPadComponent extends Component<
  DPadShapes,
  DPadTextures,
  typeof dPadInputKinds,
  DPadState
> {
  constructor(
    id: string,
    graphics: DPadGraphics,
    state: Partial<DPadState>,
    filters: T.ComponentFilterDict<DPadShapes>,
  ) {
    super(
      id,
      graphics,
      dPadInputKinds,
      { ...defaultDPadState, ...state },
      filters,
    );
  }

  private updateDirection(
    input: boolean,
    shape: Maybe<Konva.Shape>,
    on: Maybe<T.Texture>,
    off: Maybe<T.Texture>,
  ): void {
    if (input && shape && on) on.apply(shape);
    else if (!input && shape && off) off.apply(shape);
  }

  update(input: DPadInput): void {
    const { u, l, d, r } = input;
    const { shapes, textures } = this.graphics;

    this.updateDirection(u, shapes.u, textures.uOn, textures.uOff);
    this.updateDirection(l, shapes.l, textures.lOn, textures.lOff);
    this.updateDirection(d, shapes.d, textures.dOn, textures.dOff);
    this.updateDirection(r, shapes.r, textures.rOn, textures.rOff);
  }
}
