import * as T from '../../types';
import { Component } from './Component';

const inputKinds = { button: 'button' } as const;
const models = ['model'] as const;
const textures = ['on', 'off'] as const;

export const buttonComponentData: T.ComponentData<typeof inputKinds> = {
  models,
  textures,
  inputKinds,
} as const;

type ButtonModels = typeof models[number];
type ButtonTextures = typeof textures[number];
type ButtonInput = typeof inputKinds;
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
    const { button } = input;
    const {
      textures: { on, off },
      models: { model },
    } = this.graphics;

    if (button && model && on) on.apply(model);
    else if (!button && model && off) off.apply(model);
  }
}
