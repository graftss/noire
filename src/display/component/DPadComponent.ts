import Konva from 'konva';
import * as T from '../../types';
import { serializeKonvaModel } from '../model/konva';
import { Texture } from '../texture/Texture';
import { Component } from './Component';

const dirs = ['u', 'l', 'd', 'r'] as const;
type Dir = typeof dirs[number];

const inputKinds = {
  u: 'button',
  l: 'button',
  d: 'button',
  r: 'button',
} as const;

export const dPadComponentData: T.ComponentData<typeof inputKinds> = {
  models: dirs,
  textures: [
    'uOn',
    'uOff',
    'lOn',
    'lOff',
    'dOn',
    'dOff',
    'rOn',
    'rOff',
  ] as const,
  inputKinds,
};

type DPadModels = typeof dPadComponentData.models[number];
type DPadTextures = typeof dPadComponentData.textures[number];
type DPadInput = typeof dPadComponentData.inputKinds;
export type DPadState = T.ComponentState<DPadInput>;

export const defaultState: DPadState = {
  name: 'DPad Component',
};

const dPadKeys: T.ComponentKey[] = [
  { key: 'u', label: 'Up', inputKind: 'button' },
  { key: 'l', label: 'Left', inputKind: 'button' },
  { key: 'd', label: 'Down', inputKind: 'button' },
  { key: 'r', label: 'Right', inputKind: 'button' },
];

export type SerializedDPadComponent = T.SerializedComponent<
  'dPad',
  DPadModels,
  DPadTextures,
  DPadInput,
  DPadState
>;

export const dPadEditorConfig: T.ComponentEditorConfig = {
  title: 'D-Pad',
  keys: dPadKeys,
  models: dPadComponentData.models,
  textures: dPadComponentData.textures,
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
  DPadInput,
  DPadState
> {
  constructor(
    id: string,
    graphics: T.ComponentGraphics<DPadModels, DPadTextures>,
    state: Partial<DPadState>,
    filters: T.ComponentFilters<DPadModels>,
  ) {
    super(
      id,
      graphics,
      dPadComponentData.inputKinds,
      { ...defaultState, ...state },
      filters,
    );
  }

  private updateDirection(
    input: boolean,
    model: Maybe<T.KonvaModel>,
    on: Maybe<Texture>,
    off: Maybe<Texture>,
  ): void {
    if (input && model && on) on.apply(model);
    else if (!input && model && off) off.apply(model);
  }

  update(input: T.KindsToRaw<DPadInput>): void {
    const { u, l, d, r } = input;
    const { models, textures } = this.graphics;

    this.updateDirection(u, models.u, textures.uOn, textures.uOff);
    this.updateDirection(l, models.l, textures.lOn, textures.lOff);
    this.updateDirection(d, models.d, textures.dOn, textures.dOff);
    this.updateDirection(r, models.r, textures.rOn, textures.rOff);
  }
}
