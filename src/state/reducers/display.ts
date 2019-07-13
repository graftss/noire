import * as T from '../../types';
import { testInitialState } from '../testInitialState';
import { mapIf } from '../../utils';

export interface DisplayState {
  components: T.SerializedComponent[];
  selectedComponentId?: string;
}

export interface ComponentKeyBinding {
  componentId: string;
  bindingKey: string;
  controllerKey: T.ControllerKey;
}

const assocInputMap = <I>(
  bindingKey: keyof I,
  controllerKey: T.ControllerKey,
) => (
  inputMap: Record<keyof I, T.ControllerKey>,
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
      const update = assocInputMap(bindingKey, controllerKey);

      return {
        ...state,
        components: mapIf(
          state.components,
          c => c.id === componentId,
          c => ({ ...c, inputMap: update(c.inputMap) }),
        ),
      };
    }
  }

  return state;
};
