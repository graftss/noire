import * as T from '../../types';
import * as maps from '../maps';

export interface SavedDisplaysState {
  displays: T.SerializedDisplay[];
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
      return maps.upsertDisplay.proj(state)(action.data);

    case 'selectDisplay':
      return { ...state, selectedDisplayId: action.data };

    case 'removeDisplay':
      return maps.removeDisplay.proj(state)(action.data);
  }

  return state;
};
