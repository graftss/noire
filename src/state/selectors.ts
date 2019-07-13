import * as T from '../types';
import { find, keyBy } from '../utils';
import { controllerHasBinding } from '../input/controllers';

export const componentById = (
  state: Maybe<T.DisplayState>,
  id: string,
): Maybe<T.SerializedComponent> =>
  state && find(c => c.id === id, state.components);

export const controllerById = (
  state: T.InputState,
  id: string,
): Maybe<T.Controller> => state && find(c => c.id === id, state.controllers);

export const controllersById = (
  state: T.InputState,
): Record<string, T.Controller> => keyBy(state.controllers, c => c.id);

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

export const selectedController = (state: T.InputState): Maybe<T.Controller> =>
  find(c => c.id === state.selectedControllerId, state.controllers);

export const controllerKeyWithBinding = (
  state: T.InputState,
  binding: T.Binding,
): Maybe<T.ControllerKey> => {
  for (const c of state.controllers) {
    const maybeKey = controllerHasBinding(c, binding);
    if (maybeKey) return maybeKey;
  }
};
