import * as T from '../../types';
import { mapObj } from '../../utils';
import { defaultInputByKind, rawifyInputDict } from '../../input/bindings';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Component = TypedComponent<any, any>;

export interface BaseComponentState<I extends Dict<T.Input>> {
  defaultInput?: Partial<I>;
  inputMap?: Partial<Record<keyof I, Maybe<T.ControllerKey>>>;
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
    return {
      // TODO: type this accurately
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(mapObj(defaultInputByKind, this.inputKinds as any) as Required<I>),
      ...this.state.defaultInput,
      ...input,
    };
  }

  protected computeRawInput(input: Partial<I>): T.Raw<Required<I>> {
    return rawifyInputDict(this.applyDefaultInput(input));
  }

  abstract update(input: I, dt: number): void;
}
