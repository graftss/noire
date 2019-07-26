import Konva from 'konva';
import * as T from '../../types';
import { stickDistort } from '../filter/distort';
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

export type StickDistortionState = T.BaseComponentState<
  StickDistortionInput
> & {
  left: T.StickDistortConfig;
  right: T.StickDistortConfig;
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

  update(input: StickDistortionInput): void {
    const r = this.computeRawInput(input);
    const { textures, shapes } = this.graphics;
    const { left, right } = this.state;

    const leftInput = { xn: r.lxn, xp: r.lxp, yn: r.lyn, yp: r.lyp };
    const rightInput = { xn: r.rxn, xp: r.rxp, yn: r.ryn, yp: r.ryp };

    shapes.background.filters([
      stickDistort({ config: left, input: leftInput }),
      stickDistort({ config: right, input: rightInput }),
    ]);
    textures.background.apply(shapes.background);
  }
}
