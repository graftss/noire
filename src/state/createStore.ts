import { applyMiddleware, createStore as baseCreateStore, Store } from 'redux';
import { createLogger } from 'redux-logger';
import * as T from '../types';
import { rootReducer } from './reducers/root';

export type EditorStore = Store<T.EditorState, T.EditorAction>;

export const createStore = (): EditorStore => {
  const logger = createLogger();
  return baseCreateStore(rootReducer, applyMiddleware(logger));
};
