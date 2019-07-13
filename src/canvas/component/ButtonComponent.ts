import Konva from 'konva';
import * as T from '../../types';
import { TypedComponent } from './Component';

export interface ButtonConfig {
  kind: 'button';
  width?: number;
  height?: number;
  fill?: string;
  pressedFill?: string;
  inputKinds: { button: 'button' };
}

export const defaultButtonConfig: Required<ButtonConfig> = {
  kind: 'button',
  width: 30,
  height: 40,
  fill: 'black',
  pressedFill: 'darkred',
  inputKinds: { button: 'button' },
};

export type ButtonComponentConfig = ButtonConfig &
  T.BaseComponentConfig<ButtonComponentInput>;

export interface ButtonComponentInput extends Record<string, T.Input> {
  button: T.ButtonInput;
}

const defaultInput: ButtonComponentInput = {
  button: { kind: 'button', input: false },
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

export class ButtonComponent extends TypedComponent<ButtonComponentInput> {
  protected config: Required<ButtonComponentConfig>;
  private rect: Konva.Rect;

  constructor(config: ButtonComponentConfig) {
    super(
      TypedComponent.generateConfig(config, defaultButtonConfig, defaultInput),
    );

    const { width, height, fill } = this.config;

    this.rect = new Konva.Rect({
      height,
      width,
      fill,
      x: 0,
      y: 0,
    });

    this.group.add(this.rect);
  }

  update(input: ButtonComponentInput): void {
    const { button } = this.computeRawInput(input);
    const { fill, pressedFill } = this.config;

    this.rect.fill(button ? pressedFill : fill);
  }
}
