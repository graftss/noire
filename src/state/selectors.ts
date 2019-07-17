import * as T from '../types';
import { find, keyBy } from '../utils';
import { hasKeyBoundTo } from '../input/controller';

export const componentById = (
  state: Maybe<T.DisplayState>,
  id: string,
): Maybe<T.SerializedComponent> =>
  state && find(c => c.id === id, state.components);

export const allControllerBindings = (
  state: T.InputState,
): T.ControllerBindings[] => state && state.controllerBindings.all;

export const controllerBindingsById = (
  state: T.InputState,
  id: string,
): Maybe<T.ControllerBindings> =>
  state && find(c => c.id === id, state.controllerBindings.all);

export const controllerBindingsDict = (
  state: T.InputState,
): Dict<T.ControllerBindings> => keyBy(state.controllerBindings.all, c => c.id);

export const selectedControllerBindings = (
  state: T.InputState,
): Maybe<T.ControllerBindings> =>
  find(
    c => c.id === state.controllerBindings.selectedId,
    state.controllerBindings.all,
  );

export const controllerBindingsWithBinding = (
  state: T.InputState,
  binding: T.Binding,
): Maybe<{ bindings: T.ControllerBindings; key: string }> => {
  for (const bindings of state.controllerBindings.all) {
    const key = hasKeyBoundTo(bindings, binding);
    if (key) return { bindings, key };
  }
};

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
