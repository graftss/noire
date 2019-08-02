import Konva from 'konva';
import * as T from '../../types';
import { mapObj, unMaybeList, values } from '../../utils';
import { defaultInputByKind } from '../../input/input';

export interface ComponentGraphics<SS extends string, TS extends string> {
  shapes: Record<SS, Maybe<Konva.Shape>>;
  textures: Record<TS, Maybe<T.Texture>>;
}

export interface ComponentState<
  I extends Dict<T.InputKind> = Dict<T.InputKind>
> {
  defaultInput?: Partial<T.KindsToRaw<I>>;
  inputMap?: Partial<Record<keyof I, Maybe<T.ControllerKey>>>;
  name?: string;
  offset?: Vec2;
}

const defaultComponentState: Required<ComponentState> = {
  defaultInput: {},
  inputMap: {},
  name: 'Untitled component',
  offset: { x: 0, y: 0 },
};

export interface ComponentFilter<
  K extends T.InputFilterKind = T.InputFilterKind
> {
  filter: T.InputFilterFactory<K>;
  state: T.InputFilterData[K]['state'];
  inputMap: Dict<T.ControllerKey>;
}

export type ComponentFilterDict<SS extends string = string> = Record<
  SS,
  ComponentFilter<T.InputFilterKind>[]
>;

export abstract class Component<
  SS extends string = string,
  TS extends string = string,
  I extends Dict<T.InputKind> = Dict<T.InputKind>,
  S extends ComponentState<I> = ComponentState<I>
> {
  id: string;
  graphics: ComponentGraphics<SS, TS>;
  inputKinds: I;
  state: Required<S>;
  filters: Maybe<ComponentFilterDict<SS>>;

  constructor(
    id: string,
    graphics: ComponentGraphics<SS, TS>,
    inputKinds: I,
    state: S,
    filters?: ComponentFilterDict<SS>,
  ) {
    this.id = id;
    this.graphics = graphics;
    this.inputKinds = inputKinds;
    this.state = { ...defaultComponentState, ...state } as Required<S>;
    this.filters = filters;
  }

  applyDefaultInput = (
    input: Partial<T.KindsToRaw<I>>,
  ): Required<T.KindsToRaw<I>> => {
    const { defaultInput } = this.state;
    const allInput = mapObj(defaultInputByKind, this.inputKinds);

    // typescript is too confused here, it's not worth messing with
    for (const key in allInput) {
      if (input[key] !== undefined) {
        allInput[key] = input[key] as any;
      } else if (defaultInput && defaultInput[key] !== undefined) {
        allInput[key] = defaultInput[key] as any;
      }
    }

    return allInput as Required<T.KindsToRaw<I>>;
  };

  applyFilterInput(
    filterInput: Maybe<Record<string, Dict<Maybe<T.RawInput>>[]>>,
  ): void {
    if (!this.filters || !filterInput) return;

    for (const key in this.graphics.shapes) {
      if (this.filters[key]) {
        const shape = this.graphics.shapes[key] as Konva.Shape;
        const shapeFilterInput = filterInput[key];

        const initFilter = (
          { filter, state }: ComponentFilter,
          index: number,
        ): T.Filter => filter({ state, input: shapeFilterInput[index] as any });

        shape.filters(this.filters[key].map(initFilter));
      }
    }
  }

  shapeList = (): Konva.Shape[] => unMaybeList(values(this.graphics.shapes));

  // `init` is called after the component is added to the
  // `KonvaComponentPlugin`, and has been added to its
  // parent stage.
  init(): void {}

  updateState(state: S): void {
    this.state = { ...this.state, ...state };
  }

  setFilters(filters: ComponentFilterDict<SS>): void {
    this.filters = filters;
  }

  abstract update(input: Partial<T.KindsToRaw<I>>, dt: number): void;
}
