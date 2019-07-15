import * as T from '../../types';
import { areBindingsEqual, parseBinding, sourceExists } from '../source';
import { mapObj } from '../../utils';

export interface ControllerKey {
  name: string;
  inputKind: T.InputKind;
}

export type TypedController<M extends Dict<ControllerKey>, SK extends T.SourceKind> = {
  id: string;
  name: string;
  map: M;
  sourceKind: SK;
};

export type Controller = TypedController<any, any> & T.PS2Controller;

export type ControllerBindings<C extends Controller> = {
  sourceKind: C['sourceKind'];
  bindings: { [K in keyof C['map']]: T.Binding & { inputKind: C['map'][K]['inputKind'] } };
};

export const parseControllerBindings = <C extends Controller>(
  source: T.SourceContainer,
  { sourceKind, bindings } : ControllerBindings<C>,
): Maybe<Dict<Maybe<T.Input>>> =>
  (!sourceExists(source) || sourceKind !== source.kind)
    ? undefined
    : mapObj(
        bindings,
        (b: Maybe<T.Binding>) => b && parseBinding(b, source),
      );

export const stringifyControllerKey = (
  controller?: Controller,
  key?: string,
  listening?: boolean,
): string => {
  if (listening) return '(listening)';
  if (!controller) return 'NONE';

  const keyString = key && controller.map[key] ? controller.map[key].name : 'NONE';
  return `${controller.name} -> ${keyString}`;
};

export const hasKeyBoundTo = (
  { map }: Controller,
  binding: T.Binding,
): Maybe<string> => {
  for (const key in map) {
    if (map[key] && areBindingsEqual(binding, map[key])) {
      return key;
    }
  }
};
