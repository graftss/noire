import { DisplayState, EditorAction } from '../types';
import { testInitialState } from '../testInitialState';

export const displayReducer = (
  state: DisplayState = testInitialState.display,
  action: EditorAction,
): DisplayState => {
  switch (action.type) {
    case 'addBinding': {
      return {
        ...state,
        bindings: [...state.bindings, action.data],
      };
    }
  }

  return state;
};
