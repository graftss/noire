import * as T from '../types';
import { find } from '../utils';

export const componentById = (
  state: T.DisplayState,
  id: string,
): T.SerializedComponent =>
  state ? find(c => c.id === id, state.components) : undefined;

export const selectedComponentProp = <K extends keyof T.SerializedComponent>(
  state: T.DisplayState,
  prop: K,
): T.SerializedComponent[K] =>
  state && state.selectedComponent && state.selectedComponent[prop];
