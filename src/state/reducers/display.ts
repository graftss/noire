import * as T from '../../types';
import { testInitialState } from '../testInitialState';
import { componentById } from '../selectors';

export interface DisplayState {
  components: T.SerializedComponent[];
  selectedComponent?: T.SerializedComponent;
}

export const displayReducer = (
  state: DisplayState = testInitialState.display,
  action: T.EditorAction,
): DisplayState => {
  switch (action.type) {
    case 'selectComponent': {
      return { ...state, selectedComponent: componentById(state, action.data) };
    }
  }

  return state;
};
