import Konva from 'konva';
import * as T from '../../types';
import { TypedComponent } from './Component';

export interface DPadGraphics extends T.ComponentGraphics {
  shapes: {};
  textures: {};
}

export const defaultDPadGraphics: DPadGraphics = {
  shapes: {},
  textures: {},
};

type Dir = 'u' | 'l' | 'd' | 'r';
const dirs: Dir[] = ['u', 'l', 'd', 'r'];

export type DPadInput = Record<Dir, T.ButtonInput>;

export const dPadInputKinds: T.InputKindProjection<DPadInput> = {
  u: 'button',
  l: 'button',
  d: 'button',
  r: 'button',
};

export type DPadState = T.BaseComponentState<DPadInput> & {
  x: number;
  y: number;
  buttonWidth: number;
  buttonHeight: number;
  fill: string;
  pressedFill: string;
};

export const defaultDPadState: DPadState = {
  x: 0,
  y: 0,
  buttonWidth: 20,
  buttonHeight: 20,
  fill: 'black',
  pressedFill: 'darkred',
  inputMap: {},
};

export type SerializedDPadComponent = T.Serialized<
  'dpad',
  DPadState,
  DPadInput
>;

export const newSerializedDPad = (id: string): SerializedDPadComponent => ({
  id,
  kind: 'dpad',
  name: 'New DPad Component',
  graphics: {},
  inputKinds: dPadInputKinds,
  state: defaultDPadState,
});

export const dPadEditorConfig: T.ComponentEditorConfig = [
  { kind: 'fixed', data: { label: 'DPad' } },
  {
    kind: 'keys',
    data: {
      keys: [
        { key: 'u', label: 'Up', inputKind: 'button' },
        { key: 'l', label: 'Left', inputKind: 'button' },
        { key: 'd', label: 'Down', inputKind: 'button' },
        { key: 'r', label: 'Right', inputKind: 'button' },
      ],
    },
  },
];

export class DPadComponent
  extends TypedComponent<DPadGraphics, DPadInput, DPadState>
  implements T.GroupContainer {
  group: Konva.Group;
  private rects: Record<Dir, Konva.Rect>;

  constructor(id: string, graphics: DPadGraphics, state?: Partial<DPadState>) {
    super(id, graphics, dPadInputKinds, { ...defaultDPadState, ...state });

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
