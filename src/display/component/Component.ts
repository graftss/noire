import Konva from 'konva';
import * as T from '../../types';
import { mapObj, unMaybeList, values } from '../../utils';
import { defaultInputByKind } from '../../input/input';
import { Texture } from '../texture/Texture';
import { deserializeTexture } from '../texture';
import { deserializeComponentFilter } from '.';

export interface ComponentGraphics<SS extends string, TS extends string> {
  models: Record<SS, Maybe<T.KonvaModel>>;
  textures: Record<TS, Maybe<Texture>>;
}

export type ComponentState<
  I extends Dict<T.InputKind> = Dict<T.InputKind>
> = Partial<{
  defaultInput: Partial<T.KindsToRaw<I>>;
  inputMap: Partial<Record<keyof I, Maybe<T.ControllerKey>>>;
  name: string;
  offset: Vec2;
  scale: Vec2;
}>;

const defaultComponentState: Required<ComponentState> = {
  defaultInput: {},
  inputMap: {},
  name: 'Untitled component',
  offset: { x: 0, y: 0 },
  scale: { x: 1, y: 1 },
};

export interface ComponentFilter<
  K extends T.InputFilterKind = T.InputFilterKind
> {
  kind: T.InputFilterKind;
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
  filters: ComponentFilterDict<SS>;

  constructor(
    id: string,
    graphics: ComponentGraphics<SS, TS>,
    inputKinds: I,
    state: S,
    filters?: ComponentFilterDict<SS>,
  ) {
    this.id = id;
    this.graphics = graphics;
    this.graphics.models;
    this.inputKinds = inputKinds;
    this.state = { ...defaultComponentState, ...state } as Required<S>;
    this.filters = filters || mapObj(() => [], graphics.models);
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

    for (const key in this.graphics.models) {
      if (this.filters[key]) {
        const model = this.graphics.models[key] as Konva.Shape;
        const modelFilterInput = filterInput[key];

        const initFilter = (
          { filter, state }: ComponentFilter,
          index: number,
        ): T.Filter => filter({ state, input: modelFilterInput[index] as any });

        model.filters(this.filters[key].map(initFilter));
      }
    }
  }

  modelList = (): T.KonvaModel[] => unMaybeList(values(this.graphics.models));

  getModel = (name: string): Maybe<T.KonvaModel> => this.graphics.models[name];

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

  setSerializedFilter(
    modelName: SS,
    filterIndex: number,
    filter: T.SerializedComponentFilter,
  ): void {
    if (!this.filters[modelName]) this.filters[modelName] = [];
    this.filters[modelName][filterIndex] = deserializeComponentFilter(filter);
  }

  setSerializedTexture(textureName: TS, texture: T.SerializedTexture): Texture {
    const cTexture = deserializeTexture(texture);
    this.graphics.textures[textureName] = cTexture;
    return cTexture;
  }

  abstract update(input: Partial<T.KindsToRaw<I>>, dt: number): void;
}
