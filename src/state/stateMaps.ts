import * as T from '../types';
import { find } from '../utils';

export const componentById = (
  state: T.DisplayState,
  id: string,
): T.SerializedComponent =>
  state ? find(c => c.id === id, state.components) : undefined;

export const selectedComponentId = (
  state: T.DisplayState,
): string | undefined =>
  state && state.selectedComponent && state.selectedComponent.id;

export const selectedComponentBinding = (
  state: T.DisplayState,
): T.Binding | undefined => {
  const id = state.selectedComponent && state.selectedComponent.bindingId;
  return id && find(b => b.id === id, state.bindings);
};
