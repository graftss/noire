import Konva from 'konva';

import * as T from '../types';
import { TypedComponent } from '.';
import { defaults } from '../../utils';

export const defaultButtonComponentConfig: T.ButtonComponentConfig = {
  width: 30,
  height: 40,
  fill: 'black',
  pressedFill: 'darkred',
};

export class ButtonComponent extends TypedComponent<T.ButtonInput> {
  rect: Konva.Rect;

  constructor(
    baseConfig: T.BaseComponentConfig,
    private config: T.ButtonComponentConfig,
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

  update({ pressed }: T.ButtonInput): void {
    const { fill, pressedFill } = this.config;

    this.rect.fill(pressed ? pressedFill : fill);
  }
}
