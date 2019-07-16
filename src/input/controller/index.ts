import * as T from '../../types';
import { areBindingsEqual, parseBinding, sourceExists } from '../source';
import { mapObj } from '../../utils';

export interface ControllerKey {
  name: string;
  inputKind: T.InputKind;
  controllerId: string;

  // should be the same key referencing it in the controller's map.
  // there doesn't seem to be a way to get typescript to enforce
  // this via mapped types, but maybe I just couldn't figure it out
  key: string;
}

export interface BaseController {
  kind: string;
  map: Dict<ControllerKey>;
  sourceKind: T.SourceKind;
}

export interface BaseControllerBindings<C extends BaseController> {
  id: string;
  controllerKind: C['kind'];
  sourceKind: C['sourceKind'];
  bindings: Partial<
    {
      [K in keyof C['map']]: T.Binding & {
        inputKind: C['map'][K]['inputKind'];
      };
    }
  >;
}

export type Controller = T.PS2Controller;
export type ControllerKind = Controller['kind'];

export type ControllerBindings = T.PS2Bindings;

export interface ControllerBindingsKey {
  bindingsId: string;
  key: string;
}

export const parseControllerBindings = <C extends BaseController>(
  source: T.SourceContainer,
  { sourceKind, bindings }: BaseControllerBindings<C>,
): Maybe<Dict<Maybe<T.Input>>> => {
  return !sourceExists(source) || sourceKind !== source.kind
    ? undefined
    : mapObj(bindings, (b: Maybe<T.Binding>) => b && parseBinding(b, source));
};

export const stringifyControllerKey = (
  controller?: Controller,
  key?: string,
  listening?: boolean,
): string => {
  if (listening) return '(listening)';
  if (!controller || !key || !controller[key]) return 'NONE';
  return `${controller.kind} -> ${controller[key].name}`;
};

export const hasKeyBoundTo = <C extends BaseController>(
  { bindings }: BaseControllerBindings<C>,
  binding: T.Binding,
): Maybe<keyof C['map']> => {
  for (const key in bindings) {
    if (bindings[key] && areBindingsEqual(binding, bindings[key])) {
      return key;
    }
  }
};
