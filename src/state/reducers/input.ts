import * as T from '../../types';
import { mapIf } from '../../utils';
import { testInitialState } from '../testInitialState';

export type RemapState =
  | {
      kind: 'controller';
      controllerId: string;
      key: string;
      bindingKind: T.SimpleBindingKind;
    }
  | {
      kind: 'component';
      componentId: string;
      bindingKind: T.SimpleBindingKind;
    };

export interface ControllerKeyBinding {
  controllerId: string;
  key: string;
  binding: T.Binding;
}

export interface InputState {
  gamepadIndex?: number;
  remap?: RemapState;
  controllers?: T.Controller[];
  selectedControllerId?: string;
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
    case 'selectGamepad': {
      return { ...state, gamepadIndex: action.data };
    }

    case 'listenNextInput': {
      return { ...state, remap: action.data };
    }

    case 'stopListening': {
      return { ...state, remap: undefined };
    }

    case 'selectController': {
      return { ...state, selectedControllerId: action.data };
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
