import * as T from '../../types';
import { mapObj } from '../../utils';
import { defaultInputByKind, rawifyInputDict } from '../../input/input';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Component = TypedComponent<any, any>;

export type ComponentInputMap<I extends Dict<T.Input>> = Partial<
  Record<keyof I, Maybe<T.ControllerKey>>
>;

export interface BaseComponentState<I extends Dict<T.Input>> {
  defaultInput?: Partial<I>;
  inputMap: ComponentInputMap<I>;
}

export abstract class TypedComponent<
  I extends Dict<T.Input>,
  S extends BaseComponentState<I>
> {
  id: string;
  state: S;
  inputKinds: { [K in keyof I]: I[K]['kind'] };

  constructor(id, state, inputKinds) {
    this.id = id;
    this.state = state;
    this.inputKinds = inputKinds;
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

  protected computeRawInput(
    input: Partial<I>,
  ): T.RawInputProjection<Required<I>> {
    return rawifyInputDict(this.applyDefaultInput(input));
  }

  abstract update(input: I, dt: number): void;
}
