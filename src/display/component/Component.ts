import * as T from '../../types';
import { mapObj, unMaybeList, values } from '../../utils';
import { defaultInputByKind } from '../../input/input';
import { Texture } from '../texture/Texture';
import { deserializeTexture } from '../texture';
import { reifyInputFilter } from '../filter';

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

export type ComponentFilters<SS extends string = string> = Partial<
  Record<SS, T.InputFilter[]>
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
  filters: ComponentFilters<SS>;

  constructor(
    id: string,
    graphics: ComponentGraphics<SS, TS>,
    inputKinds: I,
    state: S,
    filters: ComponentFilters<SS> = {},
  ) {
    this.id = id;
    this.graphics = graphics;
    this.graphics.models;
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

  updateFilters(
    allFilterInput: Partial<Record<SS, Dict<T.RawInput>[]>> = {},
  ): void {
    if (!this.filters) return;

    for (const modelName in this.graphics.models) {
      const model = this.graphics.models[modelName as SS];
      const modelInputFilters = this.filters[modelName as SS];
      const modelInput = allFilterInput[modelName];

      if (!model || !modelInputFilters || !modelInput) continue;

      model.filters(
        modelInputFilters.map((inputFilter, index) =>
          reifyInputFilter(inputFilter, modelInput[index]),
        ),
      );
    }
  }

  modelList = (): T.KonvaModel[] => unMaybeList(values(this.graphics.models));

  getModel = (name: string): Maybe<T.KonvaModel> => this.graphics.models[name];

  setModel = (name: SS, model: T.KonvaModel): void => {
    const oldModel = this.graphics.models[name];
    if (oldModel) oldModel.destroy();

    this.graphics.models[name] = model;
  };

  // `init` is called after the component is added to the
  // `KonvaComponentPlugin`, and has been added to its
  // parent stage.
  init(): void {}

  updateState(state: S): void {
    this.state = { ...this.state, ...state };
  }

  setFilters(filters: ComponentFilters<SS>): void {
    this.filters = filters;
  }

  setInputFilter(
    { modelName, filterIndex }: T.ComponentFilterRef,
    filter: T.InputFilter,
  ): void {
    if (!this.filters[modelName]) this.filters[modelName] = [];
    this.filters[modelName][filterIndex] = filter;
  }

  setSerializedTexture(textureName: TS, texture: T.SerializedTexture): Texture {
    const cTexture = deserializeTexture(texture);
    this.graphics.textures[textureName] = cTexture;
    return cTexture;
  }

  abstract update(input: Partial<T.KindsToRaw<I>>, dt: number): void;
}
