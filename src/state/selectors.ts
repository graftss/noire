import * as T from '../types';
import { equalAtKeys, find, keyBy } from '../utils';
import { hasKeyBoundTo } from '../input/controller';

// an instance of the `LiftedSelector` type is a function on a
// substate slice of `EditorState`, lifted to a function on the
// full state. the original function on the substate is kept in
// the `proj` property of the instance, for use in e.g. reducers,
// which don't have access to the full state.

export type LiftedSelector<S extends keyof T.EditorState, V> = ((
  state: T.EditorState,
) => V) & { proj: (substate: T.EditorState[S]) => V };

export const lift = <S extends keyof T.EditorState, V>(
  substateKey: S,
  substateSelector: (substate: T.EditorState[S]) => V,
): LiftedSelector<S, V> => {
  const lifted = (state: T.EditorState): V =>
    substateSelector(state[substateKey]);

  lifted.proj = substateSelector;
  return lifted;
};

export const componentById = lift(
  'display',
  (state: Maybe<T.DisplayState>) => (
    id: string,
  ): Maybe<T.SerializedComponent> =>
    state && find(c => c.id === id, state.components),
);

export const components = lift(
  'display',
  (state: T.DisplayState): T.SerializedComponent[] => state.components,
);

export const selectedComponent = lift(
  'display',
  (state: T.DisplayState): Maybe<T.SerializedComponent> =>
    find(c => c.id === state.selectedComponentId, state.components),
);

export const controllers = lift(
  'input',
  (state: T.InputState): T.Controller[] => state && state.controller.all,
);

export const controllerById = lift(
  'input',
  (state: T.InputState) => (id: string): Maybe<T.Controller> =>
    state && find(c => c.id === id, state.controller.all),
);

export const controllersById = lift(
  'input',
  (state: T.InputState): Dict<T.Controller> =>
    keyBy(state.controller.all, c => c.id),
);

export const selectedController = lift(
  'input',
  (state: T.InputState): Maybe<T.Controller> =>
    find(c => c.id === state.controller.selectedId, state.controller.all),
);

export const controllerWithBinding = lift(
  'input',
  (state: T.InputState) => (
    binding: T.Binding,
  ): Maybe<{ controller: T.Controller; key: string }> => {
    for (const controller of state.controller.all) {
      const key = hasKeyBoundTo(controller, binding);
      if (key) return { controller, key };
    }
  },
);

export const isListening = lift(
  'input',
  (state: T.InputState) => (remap: T.RemapState): boolean => {
    if (!state.remap) return false;

    let keys: string[] = [];
    switch (remap.kind) {
      case 'controller':
        keys = ['kind', 'controllerId', 'key'];
        break;
      case 'component':
        keys = ['kind', 'componentId', 'key'];
        break;
      case 'filter':
        keys = ['kind', 'componentId', 'componentFilterKey'];
        break;
    }

    return equalAtKeys(keys, state.remap, remap);
  },
);

export const currentTabKind = lift(
  'tab',
  (state: T.TabState): T.TabKind => state.kind,
);
