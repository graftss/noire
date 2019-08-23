import * as T from '../../types';
import { upsertDisplay } from '../maps';

export interface SerializedDisplay {
  id: string;
  name: string;
  components: T.SerializedComponent[];
}

export interface SavedDisplaysState {
  displays: SerializedDisplay[];
  selectedDisplayId?: string;
}

export const initialSavedDisplaysState: SavedDisplaysState = {
  displays: [],
};

export const savedDisplaysReducer = (
  state: SavedDisplaysState = initialSavedDisplaysState,
  action: T.EditorAction,
): SavedDisplaysState => {
  switch (action.type) {
    case 'saveDisplay':
      return upsertDisplay.proj(state)(action.data);

    case 'selectDisplay': {
      return { ...state, selectedDisplayId: action.data };
    }
  }

  return state;
};
