import { find } from '../../utils';
import { BindingData } from '../../canvas/types';
import { DisplayState, EditorAction } from '../types';
import { testInitialState } from '../testInitialState';

export const displayReducer = (
  state: DisplayState = testInitialState.display,
  action: EditorAction,
): DisplayState => {
  switch (action.type) {
    case 'addBinding': {
      return find((b: BindingData) => b.id === action.data.id)(
        state.bindings,
      ) !== undefined
        ? state
        : {
            ...state,
            bindings: [...state.bindings, action.data],
          };
    }

    case 'selectComponent': {
      return { ...state };

      // return { ...state, selectedComponentId: action.data };
    }
  }

  return state;
};
