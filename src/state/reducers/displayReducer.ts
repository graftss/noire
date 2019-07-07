import * as T from '../../types';
import { find } from '../../utils';
import { testInitialState } from '../testInitialState';

export const displayReducer = (
  state: T.DisplayState = testInitialState.display,
  action: T.EditorAction,
): T.DisplayState => {
  switch (action.type) {
    case 'addBinding': {
      return find(
        (b: T.BindingData) => b.id === action.data.id,
        state.bindings,
      ) !== undefined
        ? state
        : {
            ...state,
            bindings: [...state.bindings, action.data],
          };
    }

    case 'selectComponent': {
      return { ...state, selectedComponentId: action.data };
    }
  }

  return state;
};
