import Konva from 'konva';
import * as T from '../../types';
import { TypedComponent } from './Component';

export interface ButtonComponentInput extends Dict<T.Input> {
  button: T.ButtonInput;
}

export const buttonInputKinds: T.InputKindProjection<ButtonComponentInput> = {
  button: 'button',
};

export type ButtonState = T.BaseComponentState<ButtonComponentInput> & {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  pressedFill: string;
};

export const defaultButtonState: ButtonState = {
  x: 0,
  y: 0,
  width: 30,
  height: 40,
  fill: 'black',
  pressedFill: 'darkred',
  inputMap: {},
};

export type SerializedButtonComponent = T.Serialized<
  'button',
  T.ButtonState,
  T.ButtonComponentInput
>;

export const newSerializedButton = (id: string): SerializedButtonComponent => ({
  id,
  kind: 'button',
  name: 'New Button Component',
  state: defaultButtonState,
  inputKinds: buttonInputKinds,
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
  extends TypedComponent<ButtonComponentInput, ButtonState>
  implements T.GroupContainer {
  group: Konva.Group;
  private rect: Konva.Rect;

  constructor(id: string, state?: Partial<ButtonState>) {
    super(id, { ...defaultButtonState, ...state }, buttonInputKinds);

    const { width, height, fill, x, y } = this.state;

    this.group = new Konva.Group({ x, y });
    this.rect = new Konva.Rect({
      height,
      width,
      fill,
      x: 0,
      y: 0,
    });

    this.group.add(this.rect);
  }

  update(input: Partial<ButtonComponentInput>): void {
    const { button } = this.computeRawInput(input);
    const { fill, pressedFill } = this.state;

    this.rect.fill(button ? pressedFill : fill);
  }
}
