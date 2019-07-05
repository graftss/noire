import Konva from 'konva';

import { Component } from '.';
import { defaults } from '../utils';
import {
  BaseComponentConfig,
  ButtonComponentConfig,
  ButtonInput,
} from '../types';

export const defaultButtonComponentConfig: ButtonComponentConfig = {
  width: 30,
  height: 40,
  fill: 'black',
  pressedFill: 'darkred',
};

export class ButtonComponent extends Component<ButtonInput> {
  rect: Konva.Rect;

  constructor(
    baseConfig: BaseComponentConfig,
    private config: ButtonComponentConfig,
  ) {
    super(baseConfig);
    this.config = defaults(defaultButtonComponentConfig, config);

    const { width, height, fill } = config;

    this.rect = new Konva.Rect({
      height,
      width,
      fill,
    });

    this.group.add(this.rect);
  }

  update({ pressed }: ButtonInput) {
    const { fill, pressedFill } = this.config;

    this.rect.fill(pressed ? pressedFill : fill);
  }
}
