import Konva from 'konva';
import * as T from '../../types';
import { mapObj } from '../../utils';
import { defaultInputByKind, rawifyInputDict } from '../../input/input';
import { Texture } from '../texture';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Component = TypedComponent<any, any, any>;

export type ComponentInputMap<I extends Dict<T.Input>> = Partial<
  Record<keyof I, Maybe<T.ControllerKey>>
>;

export interface BaseComponentState<I extends Dict<T.Input>> {
  defaultInput?: Partial<I>;
  inputMap: ComponentInputMap<I>;
}

export interface ComponentGraphics {
  shapes: Dict<Konva.Shape>;
  textures: Dict<Texture>;
}

export abstract class TypedComponent<
  G extends ComponentGraphics,
  I extends Dict<T.Input>,
  S extends BaseComponentState<I>
> {
  id: string;
  graphics: G;
  inputKinds: { [K in keyof I]: I[K]['kind'] };
  state: S;
  group: Konva.Group;

  constructor(id, graphics, inputKinds, state) {
    this.id = id;
    this.graphics = graphics;
    this.inputKinds = inputKinds;
    this.state = state;
  }

  protected applyDefaultInput(input: Partial<I>): Required<I> {
    const { defaultInput } = this.state;
    const allInput = mapObj(this.inputKinds, defaultInputByKind) as Required<I>;
    for (const key in allInput) {
      let i: I[Extract<keyof I, string>];

      if (input[key] !== undefined)
        i = input[key] as I[Extract<keyof I, string>];
      else if (defaultInput && defaultInput[key] !== undefined)
        i = input[key] as I[Extract<keyof I, string>];
      else i = allInput[key];

      allInput[key] = i;
    }

    return allInput;
  }

  protected computeRawInput(input: Partial<I>): T.AllRaw<I> {
    return rawifyInputDict(this.applyDefaultInput(input));
  }

  abstract update(input: I, dt: number): void;
}
