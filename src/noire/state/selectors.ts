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

export const activeDisplay = lift(
  'display',
  (state: T.DisplayState): T.SerializedDisplay => state.active,
);

export const components = lift(
  'display',
  (state: T.DisplayState): T.SerializedComponent[] =>
    state && activeDisplay.proj(state).components,
);

export const componentById = lift(
  'display',
  (state: T.DisplayState) => (id: string): Maybe<T.SerializedComponent> =>
    find(c => c.id === id, components.proj(state)),
);

export const selectedComponent = lift(
  'display',
  (state: T.DisplayState): Maybe<T.SerializedComponent> =>
    find(c => c.id === state.selectedComponentId, components.proj(
      state,
    ) as T.SerializedComponent[]),
);

export const transformerTarget = lift(
  'display',
  (state: T.DisplayState): Maybe<T.KonvaSelectable> => state.transformerTarget,
);

export const transformerVisibility = lift(
  'display',
  (state: T.DisplayState): boolean =>
    state.transformerVisibility ? true : false,
);

export const controllers = lift(
  'input',
  (state: T.InputState): T.Controller[] => state && state.controllers,
);

export const controllerById = lift(
  'input',
  (state: T.InputState) => (id: string): Maybe<T.Controller> =>
    state && find(c => c.id === id, state.controllers),
);

export const controllersById = lift(
  'input',
  (state: T.InputState): Dict<T.Controller> =>
    keyBy(c => c.id, state.controllers),
);

export const selectedController = lift(
  'input',
  (state: T.InputState): Maybe<T.Controller> =>
    find(c => c.id === state.selectedControllerId, state.controllers),
);

export const controllerWithBinding = lift(
  'input',
  (state: T.InputState) => (
    binding: T.Binding,
  ): Maybe<{ controller: T.Controller; key: string }> => {
    for (const controller of state.controllers) {
      const key = hasKeyBoundTo(controller, binding);
      if (key) return { controller, key };
    }
  },
);

export const isListening = lift(
  'input',
  (state: T.InputState) => (remap: T.RemapState): boolean => {
    if (!state.remap || !remap) return false;

    switch (remap.kind) {
      case 'controller':
        return (
          state.remap.kind === 'controller' &&
          equalAtKeys(['kind', 'controllerId', 'key'], state.remap, remap)
        );
      case 'component':
        return (
          state.remap.kind === 'component' &&
          equalAtKeys(['kind', 'componentId', 'key'], state.remap, remap)
        );
      case 'filter':
        return (
          state.remap.kind === 'filter' &&
          equalAtKeys(['kind', 'componentId', 'ref', 'key'], state.remap, remap)
        );
    }
  },
);

export const currentTabKind = lift(
  'tab',
  (state: T.TabState): T.TabKind => state.kind,
);

export const inPresentationMode = lift(
  'presentation',
  (state: T.PresentationState): boolean => state.inPresentationMode,
);

export const isPresentationSnackbarOpen = lift(
  'presentation',
  (state: T.PresentationState): boolean => state.showSnackbar,
);

export const savedDisplaysState = lift(
  'savedDisplays',
  (state: T.SavedDisplaysState): T.SavedDisplaysState => state,
);

export const savedDisplays = lift(
  'savedDisplays',
  (state: T.SavedDisplaysState): T.SerializedDisplay[] => state.displays,
);

export const selectedDisplay = lift(
  'savedDisplays',
  (state: T.SavedDisplaysState): Maybe<T.SerializedDisplay> =>
    find(d => d.id === state.selectedDisplayId, state.displays),
);

export const fps = lift(
  'local',
  (state: T.LocalState): number => state.fps,
);
