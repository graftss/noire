import * as T from '../../types';

export interface InputState {
  gamepadIndex?: number;
}

const defaultInputState: InputState = {
  gamepadIndex: undefined,
};

export const inputReducer = (state: InputState = defaultInputState, action: T.EditorAction): InputState => {
  switch (action.type) {
    case 'selectGamepad': {
      return { ...state, gamepadIndex: action.data };
    }
  }

  return state;
};
