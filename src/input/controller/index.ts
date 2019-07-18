import * as T from '../../types';
import { areBindingsEqual, parseBinding, sourceExists } from '../source';
import { mapObj } from '../../utils';
import { ps2Map } from './ps2';

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
  sourceKind: T.SourceKind;
}

export interface BaseController<C extends BaseControllerClass> {
  id: string;
  name: string;
  controllerKind: ControllerKind & C['kind'];
  sourceKind: T.SourceKind & C['sourceKind'];
  bindings: Partial<
    {
      [K in keyof C['map']]: T.Binding & {
        inputKind: C['map'][K]['inputKind'];
      };
    }
  >;
}

export type ControllerClass = T.PS2ControllerClass;
export type ControllerKind = ControllerClass['kind'];

export type Controller = T.PS2Controller;

export interface ControllerKey {
  bindingsId: string;
  key: string;
}

export const parseController = <C extends BaseControllerClass>(
  source: T.SourceContainer,
  { sourceKind, bindings }: BaseController<C>,
): Maybe<Dict<Maybe<T.Input>>> => {
  return !sourceExists(source) || sourceKind !== source.kind
    ? undefined
    : mapObj(bindings, (b: Maybe<T.Binding>) => b && parseBinding(b, source));
};

export const getControllerMap = (
  kind: ControllerKind,
): Dict<ControllerKeyData> => {
  switch (kind) {
    case 'ps2': {
      return ps2Map as Dict<ControllerKeyData>;
    }
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
  return `${controller.name}, ${map[key].name}`;
};

export const hasKeyBoundTo = <C extends BaseControllerClass>(
  { bindings }: BaseController<C>,
  binding: T.Binding,
): Maybe<keyof C['map']> => {
  for (const key in bindings) {
    if (bindings[key] && areBindingsEqual(binding, bindings[key])) {
      return key;
    }
  }
};
