import Konva from 'konva';
import * as T from '../../types';
import { FillTexture } from '../texture/FillTexture';
import { Texture } from '../texture';
import { TypedComponent } from './Component';

export interface ButtonComponentGraphics extends T.ComponentGraphics {
  shapes: { button: Konva.Shape };
  textures: { on: Texture; off: Texture };
}

export const defaultButtonGraphics: ButtonComponentGraphics = {
  shapes: { button: new Konva.Rect({ width: 30, height: 30 }) },
  textures: { on: new FillTexture('red'), off: new FillTexture('white') },
};

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

export type ButtonComponentState = T.BaseComponentState<
  ButtonComponentInput
> & {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  pressedFill: string;
};

export const defaultButtonComponentState: ButtonComponentState = {
  x: 0,
  y: 0,
  width: 30,
  height: 40,
  fill: 'black',
  pressedFill: 'darkred',
  inputMap: {},
};

export const newSerializedButton = (id: string): SerializedButtonComponent => ({
  id,
  kind: 'button',
  name: 'New Button Component',
  graphics: {},
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

export class ButtonComponent
  extends TypedComponent<
    ButtonComponentGraphics,
    ButtonComponentInput,
    ButtonComponentState
  >
  implements T.GroupContainer {
  private shape: Konva.Shape;
  private onTexture: Texture;
  private offTexture: Texture;

  constructor(
    id: string,
    graphics: ButtonComponentGraphics,
    state?: Partial<ButtonComponentState>,
  ) {
    super(id, graphics, buttonInputKinds, {
      ...defaultButtonComponentState,
      ...state,
    });
    const { width, height, x, y } = this.state;
    this.group = new Konva.Group({ x, y });

    this.shape = new Konva.Rect({ x: 0, y: 0, width, height });
    this.onTexture = new FillTexture('red');
    this.offTexture = new FillTexture('grey');
    this.group.add(this.shape);
  }

  update(input: Partial<ButtonComponentInput>): void {
    const { button } = this.computeRawInput(input);
    const texture = button ? this.onTexture : this.offTexture;
    texture.apply(this.shape);
  }
}
