import Konva from 'konva';
import * as T from '../../types';
import { FillTexture } from '../texture/FillTexture';
import { Texture } from '../texture';
import { TypedComponent } from './Component';

export interface ButtonComponentGraphics extends T.ComponentGraphics {
  shapes: { button: Konva.Shape };
  textures: { on: Texture; off: Texture };
}

export type SerializedButtonComponent = T.Serialized<
  'button',
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

export const newSerializedButton = (id: string): SerializedButtonComponent => ({
  id,
  kind: 'button',
  name: 'New Button Component',
  graphics: { shapes: {}, textures: {} },
  inputKinds: buttonInputKinds,
  state: defaultButtonComponentState,
});

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
    const texture = button ? textures.on : textures.off;

    texture.apply(shapes.button);
  }
}
