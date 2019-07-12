import Konva from 'konva';
import * as T from '../../types';
import { TypedComponent } from './Component';

const dirs = ['u', 'l', 'd', 'r'];

export interface DPadConfig {
  kind: 'dpad';
  buttonWidth?: number;
  buttonHeight?: number;
  fill?: string;
  pressedFill?: string;
}

export const defaultDPadConfig: DPadConfig = {
  kind: 'dpad',
  buttonWidth: 20,
  buttonHeight: 20,
  fill: 'black',
  pressedFill: 'darkred',
};

export type Dir = 'u' | 'l' | 'd' | 'r';

export type DPadInput = Record<Dir, T.ButtonInput>;

export type DPadComponentConfig = DPadConfig & T.BaseComponentConfig<DPadInput>;

const defaultInput: DPadInput = {
  l: { pressed: false },
  u: { pressed: false },
  d: { pressed: false },
  r: { pressed: false },
};

export class DPadComponent extends TypedComponent<DPadInput> {
  protected config: DPadComponentConfig;
  private rects: Record<Dir, Konva.Rect>;

  constructor(config: DPadComponentConfig) {
    super(
      TypedComponent.generateConfig(config, defaultDPadConfig, defaultInput),
    );

    const { buttonWidth, buttonHeight, fill } = this.config;

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

  update(rawInput: DPadInput): void {
    const input = this.applyDefaultInput(rawInput);
    const { pressedFill, fill } = this.config;

    dirs.forEach(dir =>
      this.rects[dir].fill(
        input[dir] && input[dir].pressed ? pressedFill : fill,
      ),
    );
  }
}
