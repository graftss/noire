import * as T from '../../types';
import { gamepadBindingAPI } from './gamepad';
import { keyboardBindingAPI } from './keyboard';

const bindingAPIs = {
  gamepad: gamepadBindingAPI,
  keyboard: keyboardBindingAPI,
};

export const areBindingsEqual = (
  b1: Maybe<T.Binding>,
  b2: Maybe<T.Binding>,
): boolean =>
  !b1 || !b2 || b1.sourceKind !== b2.sourceKind || !bindingAPIs[b1.sourceKind]
    ? false
    : bindingAPIs[b1.sourceKind].areBindingsEqual(b1 as any, b2 as any);

export const stringifyBinding = (b: Maybe<T.Binding>): string =>
  !b || !bindingAPIs[b.sourceKind]
    ? 'NONE'
    : bindingAPIs[b.sourceKind].stringifyBinding(b as any);
