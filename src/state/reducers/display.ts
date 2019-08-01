import * as T from '../../types';
import { testInitialState } from '../testInitialState';
import { mapComponentWithId } from '../selectors';

export interface DisplayState {
  components: T.SerializedComponent[];
  selectedComponentId?: string;
}

export interface ComponentKeyUpdate {
  componentId: string;
  inputKey: string;
  controllerId?: string;
  bindingsKey?: string;
}

export interface ComponentFilterKeyUpdate {
  componentId: string;
  shape: string;
  filterIndex: number;
  filterKey: string;
  controllerId?: string;
  bindingsKey?: string;
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

      return mapComponentWithId(state, data.id, c => ({
        ...c,
        state: data.state,
      }));
    }

    case 'updateComponentFilters': {
      const { id, filters } = action.data;

      return mapComponentWithId(state, id, c => ({
        ...c,
        filters,
      }));
    }
  }

  return state;
};
