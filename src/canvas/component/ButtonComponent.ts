import Konva from 'konva';
import * as T from '../../types';
import { TypedComponent } from './Component';

export interface ButtonConfig {
  kind: 'button';
  width?: number;
  height?: number;
  fill?: string;
  pressedFill?: string;
}

export const defaultButtonConfig: ButtonConfig = {
  kind: 'button',
  width: 30,
  height: 40,
  fill: 'black',
  pressedFill: 'darkred',
};

export type ButtonComponentConfig = ButtonConfig &
  T.BaseComponentConfig<ButtonComponentInput>;

export interface ButtonComponentInput extends Record<string, T.RawInput> {
  button: T.ButtonInput;
}

const defaultInput: ButtonComponentInput = {
  button: { pressed: false },
};

export class ButtonComponent extends TypedComponent<ButtonComponentInput> {
  protected config: ButtonComponentConfig;
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
    const { button } = this.applyDefaultInput(input);
    const { fill, pressedFill } = this.config;

    this.rect.fill(button.pressed ? pressedFill : fill);
  }
}
