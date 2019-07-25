import Konva from 'konva';
import * as T from '../../types';
import { Texture } from '../texture';
import { TypedComponent } from './Component';

type ButtonShapes = 'on' | 'off';
type ButtonTextures = 'on' | 'off';

export interface ButtonComponentGraphics
  extends T.ComponentGraphics<ButtonShapes, ButtonTextures> {
  shapes: { on: Konva.Shape; off: Konva.Shape };
  textures: { on: Texture; off: Texture };
}

export type SerializedButtonComponent = T.Serialized<
  'button',
  ButtonShapes,
  ButtonTextures,
  ButtonComponentState,
  ButtonComponentInput
>;

export interface ButtonComponentInput extends Dict<T.Input> {
  button: T.ButtonInput;
}

export const buttonInputKinds: T.InputKindProjection<ButtonComponentInput> = {
  button: 'button',
};

export type ButtonComponentState = T.BaseComponentState<ButtonComponentInput>;

export const defaultButtonComponentState: ButtonComponentState = {
  inputMap: {},
};

export const buttonEditorConfig: T.ComponentEditorConfig = [
  { kind: 'fixed', data: { label: 'Button' } },
  {
    kind: 'keys',
    data: {
      keys: [{ key: 'button', label: 'Button', inputKind: 'button' }],
    },
  },
];

export class ButtonComponent extends TypedComponent<
  ButtonShapes,
  ButtonTextures,
  ButtonComponentGraphics,
  ButtonComponentInput,
  ButtonComponentState
> {
  constructor(
    id: string,
    graphics: ButtonComponentGraphics,
    state?: Partial<ButtonComponentState>,
  ) {
    super(id, graphics, buttonInputKinds, {
      ...defaultButtonComponentState,
      ...state,
    });
  }

  update(input: Partial<ButtonComponentInput>): void {
    const { textures, shapes } = this.graphics;
    const { button } = this.computeRawInput(input);

    if (button) {
      const texture = textures.on;
      const shape = shapes.on;
      shapes.off.hide();
      shapes.on.show();
      texture.apply(shape);
    } else {
      const texture = textures.off;
      const shape = shapes.off;
      shapes.on.hide();
      shapes.off.show();
      texture.apply(shape);
    }
  }
}
