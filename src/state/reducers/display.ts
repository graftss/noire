import * as T from '../../types';
import { testInitialState } from '../testInitialState';
import { mapPath } from '../../utils';
import { mapComponentWithId } from '../selectors';

export interface DisplayState {
  components: T.SerializedComponent[];
  selectedComponentId?: string;
}

export interface ComponentKeyUpdate {
  componentId: string;
  inputKey: string;
  controllerId?: string;
  bindingsKey?: string;
}

// TODO: generalize this into a utils function `assoc`
const assocInputMap = <I>(
  inputMap: Record<keyof I, T.ControllerKey>,
  bindingKey: keyof I,
  controllerKey: Maybe<T.ControllerKey>,
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

    case 'updateComponentKey': {
      const { componentId, controllerId, bindingsKey, inputKey } = action.data;
      const controllerKey: Maybe<T.ControllerKey> =
        controllerId !== undefined && bindingsKey !== undefined
          ? { controllerId, key: bindingsKey }
          : undefined;
      const addKey = (c: T.SerializedComponent): T.SerializedComponent =>
        mapPath(
          ['state', 'inputMap'],
          (m: Record<string, T.ControllerKey>) =>
            assocInputMap(m, inputKey, controllerKey),
          c,
        );

      return mapComponentWithId(state, componentId, addKey);
    }

    case 'updateComponentName': {
      const { id, name } = action.data;
      const newName = name.length === 0 ? 'Unnamed component' : name;

      return mapComponentWithId(state, id, c => ({ ...c, name: newName }));
    }
  }

  return state;
};
