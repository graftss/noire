import * as T from '../../types';
import { testInitialState } from '../testInitialState';

export interface RemapState {
  kind: 'component';
  componentId: string;
  bindingKind: T.SimpleBindingKind;
  inputKey?: string;
}

export interface InputState {
  gamepadIndex?: number;
  remapping?: RemapState;
  controller?: T.Controller;
}

// const defaultInputState: InputState = {};
const defaultInputState = testInitialState.input;

export const inputReducer = (
  state: InputState = defaultInputState,
  action: T.EditorAction,
): InputState => {
  switch (action.type) {
    case 'selectGamepad': {
      return { ...state, gamepadIndex: action.data };
    }

    case 'listenNextInput': {
      return { ...state, remapping: action.data };
    }

    case 'stopListening': {
      return { ...state, remapping: undefined };
    }
  }

  return state;
};
