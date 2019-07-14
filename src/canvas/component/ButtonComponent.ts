import Konva from 'konva';
import * as T from '../../types';
import { TypedComponent } from './Component';

export interface ButtonComponentInput extends Dict<T.Input> {
  button: T.ButtonInput;
}

export const buttonInputKinds: T.Kinds<ButtonComponentInput> = {
  button: 'button',
};

export interface ButtonState
  extends T.BaseComponentState<ButtonComponentInput> {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  pressedFill: string;
}

export const defaultButtonState: ButtonState = {
  x: 0,
  y: 0,
  width: 30,
  height: 40,
  fill: 'black',
  pressedFill: 'darkred',
};

export const buttonEditorConfig: T.ComponentEditorConfig = [
  { kind: 'fixed', data: { label: 'Button' } },
  {
    kind: 'bindings',
    data: {
      bindings: [{ key: 'button', label: 'Button', inputKind: 'button' }],
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
