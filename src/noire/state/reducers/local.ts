import * as T from '../../types';

export interface LocalState {
  fps: number;
}

export const initialLocalState: LocalState = {
  fps: 30,
};

export const localReducer = (
  state: LocalState = initialLocalState,
  action: T.EditorAction,
): LocalState => {
  switch (action.type) {
    case 'setFps':
      return {
        ...state,
        fps: action.data,
      };
  }

  return state;
};
