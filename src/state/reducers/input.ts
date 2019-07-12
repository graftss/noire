import * as T from '../../types';
import { mapIf } from '../../utils';
import { testInitialState } from '../testInitialState';

export type RemapState =
  | {
      kind: 'controller';
      controllerId: string;
      key: string;
      inputKind: T.InputKind;
    }
  | {
      kind: 'component';
      componentId: string;
      inputKind: T.InputKind;
    };

export interface ControllerKeyBinding {
  controllerId: string;
  key: string;
  binding: T.Binding;
}

export interface InputState {
  selectedGamepadIndex?: number;
  remap?: RemapState;
  controllers: T.Controller[];
  selectedControllerId?: string;
  sourceRefs: T.InputSourceRef[];
}

// const defaultInputState: InputState = {};
const defaultInputState = testInitialState.input;

const bindControllerKey = (
  c: T.Controller,
  key: string,
  binding: T.Binding,
): T.Controller => ({
  ...c,
  map: {
    ...c.map,
    [key]: binding,
  },
});

export const inputReducer = (
  state: InputState = defaultInputState,
  action: T.EditorAction,
): InputState => {
  switch (action.type) {
    case 'selectEditorOption': {
      return {
        ...state,
        selectedGamepadIndex:
          action.data.kind === 'gamepad' ? action.data.index : undefined,
        selectedControllerId:
          action.data.kind === 'controller' ? action.data.id : undefined,
      };
    }

    case 'listenNextInput': {
      return { ...state, remap: action.data };
    }

    case 'stopListening': {
      return { ...state, remap: undefined };
    }

    case 'bindControllerKey': {
      const { controllerId, key, binding } = action.data;
      return {
        ...state,
        controllers: mapIf(
          state.controllers,
          c => c.id === controllerId,
          c => bindControllerKey(c, key, binding),
        ),
      };
    }
  }

  return state;
};
