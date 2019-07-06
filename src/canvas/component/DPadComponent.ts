import Konva from 'konva';

import * as T from '../types';
import { TypedComponent } from '.';
import { defaults } from '../../utils';

const dirs = ['u', 'l', 'd', 'r'];

export const defaultDPadComponentConfig: T.DPadComponentConfig = {
  kind: 'dpad',
  buttonWidth: 20,
  buttonHeight: 20,
  fill: 'black',
  pressedFill: 'darkred',
};

export class DPadComponent extends TypedComponent<T.DPadInput> {
  private rects: Record<T.Dir, Konva.Rect>;

  constructor(
    protected config: T.DPadComponentConfig,
  ) {
    super(config);
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

  update(input: T.DPadInput): void {
    const { pressedFill, fill } = this.config;

    dirs.forEach(dir => {
      this.rects[dir].fill(input[dir].pressed ? pressedFill : fill);
    });
  }
}
