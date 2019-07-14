import * as T from '../../types';
import { testInitialState } from '../testInitialState';
import { mapIf, withoutKey, mapPath } from '../../utils';

export interface DisplayState {
  components: T.SerializedComponent[];
  selectedComponentId?: string;
}

export interface ComponentKeyBinding {
  componentId: string;
  bindingKey: string;
  controllerKey: T.ControllerKey;
}

export type ComponentKeyUnbinding = Without<
  T.ComponentKeyBinding,
  'controllerKey'
>;

const mapComponentWithId = (
  components: T.SerializedComponent[],
  id: string,
  f: (c: T.SerializedComponent) => T.SerializedComponent,
): T.SerializedComponent[] => mapIf(components, c => c.id === id, f);

// TODO: generalize this into a utils function `assoc`
const assocInputMap = <I>(
  inputMap: Record<keyof I, T.ControllerKey>,
  bindingKey: keyof I,
  controllerKey: T.ControllerKey,
): Record<keyof I, T.ControllerKey> => ({
  ...inputMap,
  [bindingKey]: controllerKey,
});

export const displayReducer = (
  state: DisplayState = testInitialState.display,
  action: T.EditorAction,
): DisplayState => {
  switch (action.type) {
    case 'selectEditorOption': {
      const { data } = action;
      return {
        ...state,
        selectedComponentId:
          data.kind === 'component' && data.id ? data.id : undefined,
      };
    }

    case 'bindComponentKey': {
      const { componentId, controllerKey, bindingKey } = action.data;
      const addKey = (c: T.SerializedComponent): T.SerializedComponent =>
        mapPath(
          ['state', 'inputMap'],
          (m: Record<string, T.ControllerKey>) =>
            assocInputMap(m, bindingKey, controllerKey),
          c,
        );

      return {
        ...state,
        components: mapComponentWithId(state.components, componentId, addKey),
      };
    }

    case 'unbindComponentKey': {
      const { componentId, bindingKey } = action.data;
      const removeKey = (c: T.SerializedComponent): T.SerializedComponent =>
        mapPath(
          ['state', 'inputMap'],
          (m: Record<string, T.ControllerKey>) => withoutKey(m, bindingKey),
          c,
        );

      return {
        ...state,
        components: mapComponentWithId(
          state.components,
          componentId,
          removeKey,
        ),
      };
    }
  }

  return state;
};
