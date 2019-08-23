import * as T from '../../types';
import { areBindingsEqual } from '../source/bindings';
import { keys, uuid } from '../../utils';
import { ps2Config } from './ps2';
import { keyboardConfig } from './keyboard';

export interface ControllerKeyData {
  name: string;
  inputKind: T.InputKind;

  // should be the same key referencing it in the controller's map.
  // there doesn't seem to be a way to get typescript to enforce
  // this via mapped types, but maybe I just couldn't figure it out
  key: string;
}

export interface ControllerClassConfig<CK extends string = string> {
  keyOrder: readonly CK[];
  map: Readonly<Record<CK, ControllerKeyData>>;
}

export interface BaseControllerClass<CK extends string = string> {
  kind: string;
  map: Record<CK, ControllerKeyData>;
}

export interface BaseController<
  CK extends string,
  C extends BaseControllerClass<CK>
> {
  id: string;
  name: string;
  kind: ControllerKind & C['kind'];
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

const configs: Record<ControllerKind, ControllerClassConfig> = {
  ps2: ps2Config,
  keyboard: keyboardConfig,
} as const;

export const getControllerKinds = (): ControllerKind[] => keys(configs);

export const getControllerKeyOrder = (
  kind: ControllerKind,
): readonly string[] => configs[kind].keyOrder;

export const getControllerMap = (
  kind: ControllerKind,
): Readonly<Dict<ControllerKeyData>> => configs[kind].map;

export const getNewController = (kind: ControllerKind): Controller =>
  ({
    id: uuid(),
    name: `New ${kind} controller`,
    kind,
    bindings: {},
  } as Controller);

export const getKeyInputKind = (
  kind: ControllerKind,
  key: string,
): T.InputKind => getControllerMap(kind)[key].inputKind;

export const getKeyName = (kind: ControllerKind, key: string): string =>
  getControllerMap(kind)[key].name;

export const stringifyKeyInController = (
  controller: Maybe<Controller>,
  key: Maybe<string>,
  showControllerName: boolean = false,
): string => {
  if (!controller || !key || !controller.bindings[key]) return 'NONE';

  const map = getControllerMap(controller.kind);
  if (!map || !key || !map[key]) return 'NONE';
  const nameStr = showControllerName ? ` (${controller.name})` : '';
  return `${map[key].name}${nameStr}`;
};

export const stringifyControllerKey = (
  controllerKey: Maybe<ControllerKey>,
  controllersById: Dict<Controller>,
  showControllerName: boolean = false,
): string =>
  stringifyKeyInController(
    controllerKey !== undefined
      ? controllersById[controllerKey.controllerId]
      : undefined,
    controllerKey !== undefined ? controllerKey.key : undefined,
    showControllerName,
  );

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
