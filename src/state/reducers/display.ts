import * as T from '../../types';
import { testInitialState } from '../testInitialState';
import { mapComponentWithId } from '../maps';

export interface DisplayState {
  components: T.SerializedComponent[];
  selectedComponentId?: string;
}

export const displayReducer = (
  state: DisplayState = testInitialState.display,
  action: T.EditorAction,
): DisplayState => {
  switch (action.type) {
    case 'selectEditorOption': {
      const { data } = action;
      return {
        ...state,
        selectedComponentId:
          data.kind === 'component' && data.id ? data.id : undefined,
      };
    }

    case 'updateComponentState': {
      const { data } = action;

      return mapComponentWithId.proj(state)(data.id, c => ({
        ...c,
        state: data.state,
      }));
    }

    case 'updateComponentFilters': {
      const { id, filters } = action.data;

      return mapComponentWithId.proj(state)(id, c => ({ ...c, filters }));
    }
  }

  return state;
};
