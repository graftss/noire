import * as T from '../../types';
import * as maps from '../maps';
import { uuid } from '../../utils';

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

export const cloneDisplay = (
  display: T.SerializedDisplay,
): T.SerializedDisplay => ({
  ...display,
  name: `Clone of ${display.name}`,
  id: uuid(),
});

export const newDisplay = (): T.SerializedDisplay => ({
  id: uuid(),
  name: 'Untitled display',
  components: [],
});

export const setDisplayName = (
  display: T.SerializedDisplay,
  name: string,
): T.SerializedDisplay => ({
  ...display,
  name,
});

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
