import { applyMiddleware, createStore as baseCreateStore } from 'redux';
import { createLogger } from 'redux-logger';

import { EditorState, EditorAction, EditorStore } from './types';

const initialState: EditorState = {
  name: 'neptune',
};

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
