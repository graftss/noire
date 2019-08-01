import * as T from '../../types';
import { TypedComponent } from './Component';

type ButtonShapes = 'on' | 'off';
type ButtonTextures = 'on' | 'off';

export type ButtonComponentGraphics = T.ComponentGraphics<
  ButtonShapes,
  ButtonTextures
>;

export type SerializedButtonComponent = T.Serialized<
  'button',
  ButtonShapes,
  ButtonTextures,
  ButtonComponentState,
  ButtonComponentInput
>;

export interface ButtonComponentInput extends Dict<T.Input> {
  button: T.ButtonInput;
}

export const buttonInputKinds: T.InputKindProjection<ButtonComponentInput> = {
  button: 'button',
};

export type ButtonComponentState = T.TypedComponentState<ButtonComponentInput>;

export const defaultButtonComponentState: ButtonComponentState = {
  name: 'Button Component',
  inputMap: {},
};

export const buttonEditorConfig: T.ComponentEditorConfig = [
  { kind: 'fixed', data: { label: 'Button' } },
  {
    kind: 'keys',
    data: {
      keys: [{ key: 'button', label: 'Button', inputKind: 'button' }],
    },
  },
];

export class ButtonComponent extends TypedComponent<
  ButtonShapes,
  ButtonTextures,
  ButtonComponentGraphics,
  ButtonComponentInput,
  ButtonComponentState
> {
  constructor(
    id: string,
    graphics: ButtonComponentGraphics,
    state: Partial<ButtonComponentState>,
    filters: T.TypedComponentFilterDict<ButtonShapes>,
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
    const { button } = this.computeRawInput(input);

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
