import * as T from '../../types';
import { find } from '../../utils';
import { testInitialState } from '../testInitialState';
import { componentById } from '../stateMaps';

export interface DisplayState {
  bindings: T.Binding[];
  components: T.SerializedComponent[];
  selectedComponent?: T.SerializedComponent;
}

export const displayReducer = (
  state: DisplayState = testInitialState.display,
  action: T.EditorAction,
): DisplayState => {
  switch (action.type) {
    case 'addBinding': {
      return find(b => b.id === action.data.id, state.bindings) !== undefined
        ? state
        : {
            ...state,
            bindings: [...state.bindings, action.data],
          };
    }

    case 'selectComponent': {
      return { ...state, selectedComponent: componentById(state, action.data) };
    }
  }

  return state;
};
