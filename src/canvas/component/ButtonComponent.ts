import * as T from '../../types';
import { Component } from './Component';

const buttonShapes = ['on', 'off'] as const;
type ButtonShapes = typeof buttonShapes[number];

const buttonTextures = ['on', 'off'] as const;
type ButtonTextures = typeof buttonTextures[number];

export const buttonInputKinds = {
  button: 'button',
} as const;

export type ButtonComponentInput = T.KindsToRaw<typeof buttonInputKinds>;

const buttonKeys: T.ComponentKey[] = [
  { key: 'button', label: 'Button', inputKind: 'button' },
];

export type ButtonComponentState = T.ComponentState<typeof buttonInputKinds>;

export const defaultButtonComponentState: ButtonComponentState = {
  name: 'Button Component',
  inputMap: {},
};

export type SerializedButtonComponent = T.Serialized<
  'button',
  ButtonShapes,
  ButtonTextures,
  typeof buttonInputKinds,
  ButtonComponentState
>;

export const buttonEditorConfig: T.ComponentEditorConfig = {
  title: 'Button',
  keys: buttonKeys,
  shapes: buttonShapes,
  textures: buttonTextures,
};

export class ButtonComponent extends Component<
  ButtonShapes,
  ButtonTextures,
  typeof buttonInputKinds,
  ButtonComponentState
> {
  constructor(
    id: string,
    graphics: T.ComponentGraphics<ButtonShapes, ButtonTextures>,
    state: Partial<ButtonComponentState>,
    filters: T.ComponentFilterDict<ButtonShapes>,
  ) {
    super(
      id,
      graphics,
      buttonInputKinds,
      {
        ...defaultButtonComponentState,
        ...state,
      },
      filters,
    );
  }

  update(input: Partial<ButtonComponentInput>): void {
    const { textures, shapes } = this.graphics;
    const { button } = input;

    if (button && shapes.on && textures.on) {
      if (shapes.off) shapes.off.hide();
      shapes.on.show();
      textures.on.apply(shapes.on);
    } else if (shapes.off && textures.off) {
      if (shapes.on) shapes.on.hide();
      shapes.off.show();
      textures.off.apply(shapes.off);
    }
  }
}
