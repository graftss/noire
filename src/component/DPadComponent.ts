import Konva from 'konva';

import { Component } from '.';
import { defaults } from '../utils';
import * as T from '../types';

const dirs = ['u', 'l', 'd', 'r'];

export const defaultDPadComponentConfig: T.DPadComponentConfig = {
  buttonWidth: 20,
  buttonHeight: 20,
  fill: 'black',
  pressedFill: 'darkred',
};

export class DPadComponent extends Component<T.DPadInput> {
  rects: Record<T.Dir, Konva.Rect>;

  constructor(
    baseConfig: T.BaseComponentConfig,
    private config: T.DPadComponentConfig,
  ) {
    super(baseConfig);
    this.config = defaults(defaultDPadComponentConfig, config);

    const { buttonWidth, buttonHeight, fill } = config;

    this.rects = {
      u: new Konva.Rect({
        x: 0,
        y: -buttonHeight,
        width: buttonWidth,
        height: buttonHeight,
        fill,
      }),
      l: new Konva.Rect({
        x: -buttonWidth,
        y: 0,
        width: buttonWidth,
        height: buttonHeight,
        fill,
      }),
      d: new Konva.Rect({
        x: 0,
        y: buttonHeight,
        width: buttonWidth,
        height: buttonHeight,
        fill,
      }),
      r: new Konva.Rect({
        x: buttonWidth,
        y: 0,
        width: buttonWidth,
        height: buttonHeight,
        fill,
      }),
    };

    dirs.forEach(dir => this.group.add(this.rects[dir]));
  }

  update(input: T.DPadInput) {
    const { pressedFill, fill } = this.config;

    dirs.forEach(dir => {
      this.rects[dir].fill(input[dir].pressed ? pressedFill : fill);
    });
  }
}
