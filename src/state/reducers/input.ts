import * as T from '../../types';
import { testInitialState } from '../testInitialState';

export interface NextInputListenerState {
  inputKind: T.ListeningKind;
}

export interface InputState {
  gamepadIndex?: number;
  nextInputListener?: NextInputListenerState;
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
      return { ...state, nextInputListener: { inputKind: action.data } };
    }

    case 'stopListening': {
      return { ...state, nextInputListener: undefined };
    }
  }

  return state;
};
