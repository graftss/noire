import Konva from 'konva';
import * as T from '../../types';
import { TypedComponent } from './Component';

const dirs = ['u', 'l', 'd', 'r'];

export interface DPadConfig {
  kind: 'dpad';
  inputKinds: Record<Dir, 'button'>;
  buttonWidth?: number;
  buttonHeight?: number;
  fill?: string;
  pressedFill?: string;
}

export const defaultDPadConfig: Required<DPadConfig> = {
  kind: 'dpad',
  inputKinds: { u: 'button', l: 'button', d: 'button', r: 'button' },
  buttonWidth: 20,
  buttonHeight: 20,
  fill: 'black',
  pressedFill: 'darkred',
};

export const dPadEditorConfig: T.ComponentEditorConfig = [
  { kind: 'fixed', data: { label: 'DPad' } },
  {
    kind: 'bindings',
    data: {
      bindings: [
        { key: 'u', label: 'Up', inputKind: 'button' },
        { key: 'l', label: 'Left', inputKind: 'button' },
        { key: 'd', label: 'Down', inputKind: 'button' },
        { key: 'r', label: 'Right', inputKind: 'button' },
      ],
    },
  },
];

export type Dir = 'u' | 'l' | 'd' | 'r';

export type DPadInput = Record<Dir, T.ButtonInput>;

export type DPadComponentConfig = DPadConfig & T.BaseComponentConfig<DPadInput>;

const defaultInput: DPadInput = {
  l: { kind: 'button', input: false },
  u: { kind: 'button', input: false },
  d: { kind: 'button', input: false },
  r: { kind: 'button', input: false },
};

export class DPadComponent extends TypedComponent<DPadInput> {
  protected config: Required<DPadComponentConfig>;
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

  update(input: DPadInput): void {
    const rawInput = this.computeRawInput(input);
    const { pressedFill, fill } = this.config;

    dirs.forEach(dir =>
      this.rects[dir].fill(rawInput[dir] ? pressedFill : fill),
    );
  }
}
