import * as T from '../types';
import { mapObj } from '../utils';
import { applyBinding, areBindingsEqual } from './bindings';
import { isSourceNull } from './sources';
import { controllerData } from './keymaps';

export type Controller = {
  id: string;
  name: string;
  map: Record<string, T.Binding>;
  kind: string;
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

export const stringifyControllerKey = (
  controller?: Controller,
  key?: string,
  listening?: boolean,
): string => {
  if (listening) return '(listening)';
  if (!controller) return 'NONE';

  const keyString = key ? controllerData[controller.kind][key].name : 'NONE';
  return `${controller.name} -> ${keyString}`;
};

export const controllerHasBinding = (
  { map, id: controllerId }: Controller,
  binding: T.Binding,
): Maybe<ControllerKey> => {
  for (const key in map) {
    if (map[key] && areBindingsEqual(binding, map[key])) {
      return { controllerId, key };
    }
  }
};
