import * as T from '../../types';
import { Component } from './Component';

const inputKinds = { button: 'button' } as const;

export const buttonComponentData: T.ComponentData<typeof inputKinds> = {
  models: ['on', 'off'] as const,
  textures: ['on', 'off'] as const,
  inputKinds,
};

type ButtonModels = typeof buttonComponentData.models[number];
type ButtonTextures = typeof buttonComponentData.textures[number];
type ButtonInput = typeof buttonComponentData.inputKinds;
export type ButtonComponentState = T.ComponentState<ButtonInput>;

const buttonKeys: T.ComponentKey[] = [
  { key: 'button', label: 'Pressed', inputKind: 'button' },
];

export const defaultState: ButtonComponentState = {
  name: 'Button Component',
};

export type SerializedButtonComponent = T.SerializedComponent<
  'button',
  ButtonModels,
  ButtonTextures,
  ButtonInput,
  ButtonComponentState
>;

export const buttonEditorConfig: T.ComponentEditorConfig = {
  title: 'Button',
  keys: buttonKeys,
  models: buttonComponentData.models,
  textures: buttonComponentData.textures,
};

export class ButtonComponent extends Component<
  ButtonModels,
  ButtonTextures,
  ButtonInput,
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
      buttonComponentData.inputKinds,
      { ...defaultState, ...state },
      filters,
    );
  }

  update(input: T.KindsToRaw<ButtonInput>): void {
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
