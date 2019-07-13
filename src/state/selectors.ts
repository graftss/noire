import * as T from '../types';
import { find, keyBy } from '../utils';

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

export const selectedComponentProp = <K extends keyof T.SerializedComponent>(
  state: Maybe<T.DisplayState>,
  prop: K,
): Maybe<T.SerializedComponent[K]> =>
  state && state.selectedComponent && state.selectedComponent[prop];

export const selectedController = (state: T.InputState): Maybe<T.Controller> =>
  find(c => c.id === state.selectedControllerId, state.controllers);
