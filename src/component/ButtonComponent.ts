import Konva from 'konva';

import Component, { BaseComponentConfig } from '.';
import { defaults } from '../utils';
import { ButtonInput } from '../types';

export interface ButtonComponentConfig {
  width?: number;
  height?: number;
  fill?: string;
  pressedFill?: string;
}

export const defaultButtonComponentConfig: ButtonComponentConfig = {
  width: 30,
  height: 40,
  fill: 'black',
  pressedFill: 'darkred',
};

export default class ButtonComponent extends Component<ButtonInput> {
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
