import { applyMiddleware, createStore as baseCreateStore, Store } from 'redux';
import { createLogger } from 'redux-logger';

export interface EditorState {
  name: string;
}

const initialState: EditorState = {
  name: 'neptune',
};

export interface EditorAction {
  type: 'setname';
  data: string;
}

export type EditorStore = Store<EditorState, EditorAction>;

const reducer = (
  state: EditorState = initialState,
  action: EditorAction,
): EditorState => {
  switch (action.type) {
    case 'setname':
      return { ...state, name: action.data };
  }

  return state;
};

export const createStore = (): EditorStore => {
  const logger = createLogger();
  return baseCreateStore(reducer, applyMiddleware(logger));
};
