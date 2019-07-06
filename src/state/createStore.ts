import { applyMiddleware, createStore as baseCreateStore } from 'redux';
import { createLogger } from 'redux-logger';

import { EditorStore } from './types';
import { reducer } from './reducers';

export const createStore = (): EditorStore => {
  const logger = createLogger();
  return baseCreateStore(reducer, applyMiddleware(logger));
};
