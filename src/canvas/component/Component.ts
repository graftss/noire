import Konva from 'konva';
import * as T from '../../types';
import { mapObj, unMaybeList, values } from '../../utils';
import { defaultInputByKind, rawifyInputDict } from '../../input/input';

export interface ComponentGraphics<SS extends string, TS extends string> {
  shapes: Record<SS, Maybe<Konva.Shape>>;
  textures: Record<TS, Maybe<T.Texture>>;
}

type InputKinds<I extends Dict<T.Input>> = {
  [K in keyof I]: I[K]['kind'];
};

export interface ComponentState<I extends Dict<T.Input> = Dict<T.Input>> {
  defaultInput?: Partial<I>;
  inputMap?: Partial<Record<keyof I, Maybe<T.ControllerKey>>>;
  name: string;
}

export interface ComponentFilter<K extends T.InputFilterKind> {
  filter: T.InputFilter<K>;
  config: T.InputFilterData[K]['config'];
  inputMap: Dict<T.ControllerKey>;
}

export type ComponentFilterDict<SS extends string = string> = Record<
  SS,
  ComponentFilter<T.InputFilterKind>[]
>;

export abstract class Component<
  SS extends string = string,
  TS extends string = string,
  I extends Dict<T.Input> = Dict<T.Input>,
  S extends ComponentState<I> = ComponentState<I>
> {
  id: string;
  graphics: ComponentGraphics<SS, TS>;
  inputKinds: InputKinds<I>;
  state: S;
  filters: Maybe<ComponentFilterDict<SS>>;

  constructor(
    id: string,
    graphics: ComponentGraphics<SS, TS>,
    inputKinds: InputKinds<I>,
    state: S,
    filters?: ComponentFilterDict<SS>,
  ) {
    this.id = id;
    this.graphics = graphics;
    this.inputKinds = inputKinds;
    this.state = state;
    this.filters = filters;
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

  applyFilterInput(
    filterInput: Maybe<Record<string, Dict<Maybe<T.Input>>[]>>,
  ): void {
    if (!this.filters || !filterInput) return;

    for (const key in this.graphics.shapes) {
      if (this.filters[key]) {
        const shape = this.graphics.shapes[key] as Konva.Shape;
        const shapeFilterInput = filterInput[key].map(rawifyInputDict);
        shape.filters(
          this.filters[key].map(({ filter, config }, index: number) =>
            filter(config)(shapeFilterInput[index] as any),
          ),
        );
      }
    }
  }

  shapeList = (): Konva.Shape[] => unMaybeList(values(this.graphics.shapes));

  // `init` is called after the component is added to the
  // `KonvaComponentPlugin`, and has been added to its
  // parent stage.
  init(): void {}

  setState(state: S): void {
    this.state = state;
  }

  setFilters(filters: ComponentFilterDict<SS>): void {
    this.filters = filters;
  }

  abstract update(input: Partial<I>, dt: number): void;
}
