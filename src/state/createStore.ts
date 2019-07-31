import {
  applyMiddleware,
  createStore as baseCreateStore,
  Dispatch,
  Store,
  Middleware,
} from 'redux';
import { createLogger } from 'redux-logger';
import * as T from '../types';
import { DisplayEventBus } from '../canvas/display/DisplayEventBus';
import { rootReducer } from './reducers/root';

export type EditorStore = Store<T.EditorState, T.EditorAction>;

type EditorMiddleware = Middleware<{}, T.EditorState, Dispatch<T.EditorAction>>;

const createDisplayEmitter = (
  eventBus: DisplayEventBus,
): EditorMiddleware => () => next => (action: T.EditorAction) => {
  if (action.type === 'emitDisplayEvents') {
    action.data.forEach(eventBus.emit);
  }

  return next(action);
};

export const createStore = (eventBus: DisplayEventBus): EditorStore => {
  const logger = createLogger();
  const displayEmitter = createDisplayEmitter(eventBus);

  return baseCreateStore(rootReducer, applyMiddleware(displayEmitter, logger));
};
