import * as T from '../../types';
import { Component } from './Component';

const buttonModels = ['on', 'off'] as const;
type ButtonModels = typeof buttonModels[number];

const buttonTextures = ['on', 'off'] as const;
type ButtonTextures = typeof buttonTextures[number];

export const buttonInputKinds = {
  button: 'button',
} as const;

export type ButtonComponentInput = T.KindsToRaw<typeof buttonInputKinds>;

const buttonKeys: T.ComponentKey[] = [
  { key: 'button', label: 'Pressed', inputKind: 'button' },
];

export type ButtonComponentState = T.ComponentState<typeof buttonInputKinds>;

export const defaultState: ButtonComponentState = {
  name: 'Button Component',
};

export type SerializedButtonComponent = T.SerializedComponent<
  'button',
  ButtonModels,
  ButtonTextures,
  typeof buttonInputKinds,
  ButtonComponentState
>;

export const buttonEditorConfig: T.ComponentEditorConfig = {
  title: 'Button',
  keys: buttonKeys,
  models: buttonModels,
  textures: buttonTextures,
};

export class ButtonComponent extends Component<
  ButtonModels,
  ButtonTextures,
  typeof buttonInputKinds,
  ButtonComponentState
> {
  constructor(
    id: string,
    graphics: T.ComponentGraphics<ButtonModels, ButtonTextures>,
    state: Partial<ButtonComponentState>,
    filters: T.ComponentFilterDict<ButtonModels>,
  ) {
    super(
      id,
      graphics,
      buttonInputKinds,
      { ...defaultState, ...state },
      filters,
    );
  }

  update(input: Partial<ButtonComponentInput>): void {
    const { textures, models } = this.graphics;
    const { button } = input;

    if (button && models.on && textures.on) {
      if (models.off) models.off.hide();
      models.on.show();
      textures.on.apply(models.on);
    } else if (models.off && textures.off) {
      if (models.on) models.on.hide();
      models.off.show();
      textures.off.apply(models.off);
    }
  }
}
