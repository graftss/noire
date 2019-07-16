import * as T from '../../types';
import { testInitialState } from '../testInitialState';
import { mapIf, mapPath } from '../../utils';

export interface DisplayState {
  components: T.SerializedComponent[];
  selectedComponentId?: string;
}

export interface ComponentKeyUpdate {
  componentId: string;
  inputKey: string;
  bindingsId?: string;
  bindingsKey?: string;
}

const mapComponentWithId = (
  components: T.SerializedComponent[],
  id: string,
  f: (c: T.SerializedComponent) => T.SerializedComponent,
): T.SerializedComponent[] => mapIf(components, c => c.id === id, f);

// TODO: generalize this into a utils function `assoc`
const assocInputMap = <I>(
  inputMap: Record<keyof I, T.ControllerBindingsKey>,
  bindingKey: keyof I,
  controllerKey: Maybe<T.ControllerBindingsKey>,
): Record<keyof I, T.ControllerBindingsKey> => ({
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
      const { componentId, bindingsId, bindingsKey, inputKey } = action.data;
      const controllerBindingsKey: Maybe<T.ControllerBindingsKey> =
        bindingsId !== undefined && bindingsKey !== undefined
          ? { bindingsId, key: bindingsKey }
          : undefined;
      const addKey = (c: T.SerializedComponent): T.SerializedComponent =>
        mapPath(
          ['state', 'inputMap'],
          (m: Record<string, T.ControllerBindingsKey>) =>
            assocInputMap(m, inputKey, controllerBindingsKey),
          c,
        );

      return {
        ...state,
        components: mapComponentWithId(state.components, componentId, addKey),
      };
    }
  }

  return state;
};
