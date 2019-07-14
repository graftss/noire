import Konva from 'konva';
import * as T from '../../types';
import { TypedComponent } from './Component';

type Dir = 'u' | 'l' | 'd' | 'r';
const dirs: Dir[] = ['u', 'l', 'd', 'r'];

export type DPadInput = Record<Dir, T.ButtonInput>;

export const dPadInputKinds: T.Kinds<DPadInput> = {
  u: 'button',
  l: 'button',
  d: 'button',
  r: 'button',
};

export interface DPadState extends T.BaseComponentState<DPadInput> {
  x: number;
  y: number;
  buttonWidth: number;
  buttonHeight: number;
  fill: string;
  pressedFill: string;
}

export const defaultDPadState: DPadState = {
  x: 0,
  y: 0,
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

export class DPadComponent extends TypedComponent<DPadInput, DPadState>
  implements T.GroupContainer {
  group: Konva.Group;
  private rects: Record<Dir, Konva.Rect>;

  constructor(id: string, state?: Partial<DPadState>) {
    super(id, { ...defaultDPadState, ...state }, dPadInputKinds);

    const { buttonWidth, buttonHeight, fill, x, y } = this.state;

    this.group = new Konva.Group({ x, y });
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
    const { pressedFill, fill } = this.state;

    dirs.forEach(dir =>
      this.rects[dir].fill(rawInput[dir] ? pressedFill : fill),
    );
  }
}
