import * as T from '../../types';
import { areBindingsEqual } from '../source/bindings';
import { ps2Map } from './ps2';
import { keyboardMap } from './keyboard';

export interface ControllerKeyData {
  name: string;
  inputKind: T.InputKind;

  // should be the same key referencing it in the controller's map.
  // there doesn't seem to be a way to get typescript to enforce
  // this via mapped types, but maybe I just couldn't figure it out
  key: string;
}

export interface BaseControllerClass {
  kind: string;
  map: Dict<ControllerKeyData>;
}

export interface BaseController<C extends BaseControllerClass> {
  id: string;
  name: string;
  controllerKind: ControllerKind & C['kind'];
  bindings: Partial<
    {
      [K in keyof C['map']]: T.Binding & {
        inputKind: C['map'][K]['inputKind'];
      };
    }
  >;
}

export type ControllerClass = T.PS2ControllerClass | T.KeyboardControllerClass;
export type ControllerKind = ControllerClass['kind'];

export type Controller = T.PS2Controller | T.KeyboardController;

export interface ControllerKey {
  controllerId: string;
  key: string;
}

export const getControllerMap = (
  kind: ControllerKind,
): Dict<ControllerKeyData> => {
  switch (kind) {
    case 'ps2':
      return ps2Map;
    case 'keyboard':
      return keyboardMap;
  }
};

export const getKeyInputKind = (
  kind: ControllerKind,
  key: string,
): T.InputKind => getControllerMap(kind)[key].inputKind;

export const stringifyControllerKey = (
  controller: Controller,
  key: string,
  listening?: boolean,
): string => {
  if (listening) return '(listening)';
  const map = getControllerMap(controller.controllerKind);
  if (!map || !key || !map[key]) return 'NONE';
  return `${map[key].name} (${controller.name})`;
};

export const hasKeyBoundTo = (
  { bindings }: T.Controller,
  binding: T.Binding,
): Maybe<string> => {
  for (const key in bindings) {
    if (bindings[key] && areBindingsEqual(binding, bindings[key])) {
      return key;
    }
  }
};
