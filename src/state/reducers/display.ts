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
    case 'selectEditorOption': {
      return {
        ...state,
        selectedComponent:
          action.data.kind === 'component' && action.data.id
            ? componentById(state, action.data.id)
            : undefined,
      };
    }
  }

  return state;
};
