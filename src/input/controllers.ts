import * as T from '../types';
import { mapObj } from '../utils';
import { applyBinding } from './bindings';
import { isSourceNull } from './sources';

export type Controller = {
  id: string;
  name: string;
  map: Record<string, T.Binding>;
} & T.GamepadMap;

export interface ControllerKey {
  controllerId: string;
  key: string;
}

export const applyControllerKeymap = (
  source: T.InputSource,
  controller: T.Controller,
): Maybe<T.Keymap> =>
  isSourceNull(source)
    ? undefined
    : mapObj(
        controller.map,
        (b: Maybe<T.Binding>) => b && applyBinding(source, b),
      );
