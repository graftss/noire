import Konva from 'konva';

import Component, { BaseComponentConfig } from '.';
import { DPadInput, DPadDict, ButtonInput } from '../gamepad/inputMaps';
import { defaults } from '../utils';

const dirs = ['u', 'l', 'd', 'r'];

export interface DPadComponentConfig {
  buttonWidth?: number;
  buttonHeight?: number;
  fill?: string;
  pressedFill?: string;
}

export const defaultDPadComponentConfig: DPadComponentConfig = {
  buttonWidth: 20,
  buttonHeight: 20,
  fill: 'black',
  pressedFill: 'darkred',
};

export default class DPadComponent extends Component<DPadInput> {
  rects: DPadDict<Konva.Rect>;

  constructor(
    baseConfig: BaseComponentConfig,
    private config: DPadComponentConfig,
  ) {
    super(baseConfig);
    this.config = defaults(defaultDPadComponentConfig, config);

    const { buttonWidth, buttonHeight } = config;

    this.rects = {
      u: new Konva.Rect({
        x: 0,
        y: -buttonHeight,
        width: buttonWidth,
        height: buttonHeight,
      }),
      l: new Konva.Rect({
        x: -buttonWidth,
        y: 0,
        width: buttonWidth,
        height: buttonHeight,
      }),
      d: new Konva.Rect({
        x: 0,
        y: buttonHeight,
        width: buttonWidth,
        height: buttonHeight,
      }),
      r: new Konva.Rect({
        x: buttonWidth,
        y: 0,
        width: buttonWidth,
        height: buttonHeight,
      }),
    };

    dirs.forEach(dir => this.group.add(this.rects[dir]));
  }

  update(input: DPadInput) {
    const { pressedFill, fill } = this.config;

    dirs.forEach(dir => {
      this.rects[dir].fill(input[dir].pressed ? pressedFill : fill);
    });
  }
}
