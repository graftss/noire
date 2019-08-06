import Konva from 'konva';
import * as T from '../../types';
import { serializeKonvaModel } from '../model/konva';
import { Component } from './Component';

const dirs = ['u', 'l', 'd', 'r'] as const;
type Dir = typeof dirs[number];

const dPadModels = dirs;
type DPadModels = Dir;

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
};

export type SerializedDPadComponent = T.SerializedComponent<
  'dpad',
  DPadModels,
  DPadTextures,
  typeof dPadInputKinds,
  DPadState
>;

export const dPadEditorConfig: T.ComponentEditorConfig = {
  title: 'D-Pad',
  keys: dPadKeys,
  models: dPadModels,
  textures: dPadTextures,
};

export const simpleDPadRects = (
  x: number,
  y: number,
  width: number,
  height: number,
): Record<DPadModels, T.SerializedKonvaModel<'Rect'>> => ({
  u: serializeKonvaModel(
    new Konva.Rect({
      x,
      y: y - height,
      width,
      height,
    }),
  ),
  l: serializeKonvaModel(
    new Konva.Rect({
      x: x - width,
      y,
      width,
      height,
    }),
  ),
  d: serializeKonvaModel(
    new Konva.Rect({
      x,
      y: y + height,
      width,
      height,
    }),
  ),
  r: serializeKonvaModel(
    new Konva.Rect({
      x: x + width,
      y,
      width,
      height,
    }),
  ),
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
  DPadModels,
  DPadTextures,
  typeof dPadInputKinds,
  DPadState
> {
  constructor(
    id: string,
    graphics: T.ComponentGraphics<DPadModels, DPadTextures>,
    state: Partial<DPadState>,
    filters: T.ComponentFilterDict<DPadModels>,
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
    model: Maybe<Konva.Shape>,
    on: Maybe<T.Texture>,
    off: Maybe<T.Texture>,
  ): void {
    if (input && model && on) on.apply(model);
    else if (!input && model && off) off.apply(model);
  }

  update(input: DPadInput): void {
    const { u, l, d, r } = input;
    const { models, textures } = this.graphics;

    this.updateDirection(u, models.u, textures.uOn, textures.uOff);
    this.updateDirection(l, models.l, textures.lOn, textures.lOff);
    this.updateDirection(d, models.d, textures.dOn, textures.dOff);
    this.updateDirection(r, models.r, textures.rOn, textures.rOff);
  }
}
