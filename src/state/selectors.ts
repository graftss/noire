import * as T from '../types';
import { find, keyBy, mapIf } from '../utils';
import { hasKeyBoundTo } from '../input/controller';

export const componentById = (
  state: Maybe<T.DisplayState>,
  id: string,
): Maybe<T.SerializedComponent> =>
  state && find(c => c.id === id, state.components);

export const allController = (state: T.InputState): T.Controller[] =>
  state && state.controller.all;

export const controllerById = (
  state: T.InputState,
  id: string,
): Maybe<T.Controller> => state && find(c => c.id === id, state.controller.all);

export const controllersById = (state: T.InputState): Dict<T.Controller> =>
  keyBy(state.controller.all, c => c.id);

export const selectedController = (state: T.InputState): Maybe<T.Controller> =>
  find(c => c.id === state.controller.selectedId, state.controller.all);

export const controllerWithBinding = (
  state: T.InputState,
  binding: T.Binding,
): Maybe<{ bindings: T.Controller; key: string }> => {
  for (const bindings of state.controller.all) {
    const key = hasKeyBoundTo(bindings, binding);
    if (key) return { bindings, key };
  }
};

export const allComponents = (state: T.DisplayState): T.SerializedComponent[] =>
  state.components;

export const selectedComponent = (
  state: T.DisplayState,
): Maybe<T.SerializedComponent> =>
  find(c => c.id === state.selectedComponentId, state.components);

export const selectedComponentProp = <K extends keyof T.SerializedComponent>(
  state: Maybe<T.DisplayState>,
  prop: K,
): Maybe<T.SerializedComponent[K]> => {
  if (!state) return;
  const c = selectedComponent(state);
  return c && c[prop];
};

export const mapComponentWithId = (
  state: T.DisplayState,
  id: string,
  f: Auto<T.SerializedComponent>,
): T.DisplayState => ({
  ...state,
  components: mapIf(state.components, c => c.id === id, f),
});
