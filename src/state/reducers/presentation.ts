import * as T from '../../types';

export interface PresentationState {
  inPresentationMode: boolean;
  showSnackbar: boolean;
}

const initialState: PresentationState = {
  inPresentationMode: false,
  showSnackbar: false,
};

export const presentationReducer = (
  state: PresentationState = initialState,
  action: T.EditorAction,
): PresentationState => {
  switch (action.type) {
    case 'enterPresentationMode':
      return { ...state, inPresentationMode: true, showSnackbar: true };
    case 'closePresentationSnackbar':
      return { ...state, showSnackbar: false };
    case 'exitPresentationMode':
      return { ...state, inPresentationMode: false, showSnackbar: false };
  }

  return state;
};
