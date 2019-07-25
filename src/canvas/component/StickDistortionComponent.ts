import Konva from 'konva';
import * as T from '../../types';
import { DistortFilter } from '../texture/filters';
import { TypedComponent } from './Component';

type StickDistortionShapes = 'background';
type StickDistortionTextures = 'background';

export interface StickDistortionGraphics
  extends T.ComponentGraphics<StickDistortionShapes, StickDistortionTextures> {
  shapes: { background: Konva.Shape };
  textures: { background: T.Texture };
}

export interface StickDistortionInput extends Dict<T.Input> {
  lxp: T.AxisInput;
  lxn: T.AxisInput;
  lyp: T.AxisInput;
  lyn: T.AxisInput;
  lButton: T.ButtonInput;
  rxp: T.AxisInput;
  rxn: T.AxisInput;
  ryp: T.AxisInput;
  ryn: T.AxisInput;
  rButton: T.ButtonInput;
}

export const stickDistortionInputKinds: T.InputKindProjection<
  StickDistortionInput
> = {
  lxp: 'axis',
  lxn: 'axis',
  lyp: 'axis',
  lyn: 'axis',
  lButton: 'button',
  rxp: 'axis',
  rxn: 'axis',
  ryp: 'axis',
  ryn: 'axis',
  rButton: 'button',
};

export interface StickDistortionStickState {
  xc: number;
  yc: number;
  R: number;
  r: number;
  debug?: boolean;
}

export type StickDistortionState = T.BaseComponentState<
  StickDistortionInput
> & {
  left: StickDistortionStickState;
  right: StickDistortionStickState;
};

export const stickDistortionEditorConfig: T.ComponentEditorConfig = [
  { kind: 'fixed', data: { label: 'Stick Distorted Texture' } },
];

export type SerializedStickDistortionComponent = T.Serialized<
  'stickDistortion',
  StickDistortionShapes,
  StickDistortionTextures,
  StickDistortionState,
  StickDistortionInput
>;

export class StickDistortionComponent extends TypedComponent<
  StickDistortionShapes,
  StickDistortionTextures,
  StickDistortionGraphics,
  StickDistortionInput,
  StickDistortionState
> {
  constructor(
    id: string,
    graphics: StickDistortionGraphics,
    state: Partial<StickDistortionState>,
  ) {
    super(id, graphics, stickDistortionInputKinds, state);
  }

  createFilter(
    { xc, yc, R, r, debug }: StickDistortionStickState,
    stickX: number,
    stickY: number,
  ): (data: ImageData) => void {
    const fState = {
      xc,
      yc,
      R,
      r,
      xd: r + stickX * (R - r),
      yd: r + stickY * (R - r),
      debug,
    };

    return DistortFilter(fState);
  }

  update(input: StickDistortionInput): void {
    const r = this.computeRawInput(input);
    const { textures, shapes } = this.graphics;
    const { left, right } = this.state;

    const lx = r.lxn > 0 ? -r.lxn : r.lxp > 0 ? r.lxp : 0;
    const ly = r.lyn > 0 ? -r.lyn : r.lyp > 0 ? r.lyp : 0;
    const rx = r.rxn > 0 ? -r.rxn : r.rxp > 0 ? r.rxp : 0;
    const ry = r.ryn > 0 ? -r.ryn : r.ryp > 0 ? r.ryp : 0;

    shapes.background.filters([
      this.createFilter(left, lx, ly),
      // this.createFilter(right, rx, ry),
    ]);

    textures.background.apply(shapes.background);
  }
}
