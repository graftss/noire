import {
  applyMiddleware,
  compose,
  createStore as baseCreateStore,
  Dispatch,
  Store,
  Middleware,
} from 'redux';
import persistState from 'redux-localstorage';
import { createLogger } from 'redux-logger';
import * as T from '../types';
import { DisplayEventBus } from '../display/events/DisplayEventBus';
import { rootReducer } from './reducers/root';
import { serializeEditorState, deserializePersistentString } from './persist';

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
  const displayEmitter = createDisplayEmitter(eventBus);
  const middleware =
    process.env.NODE_ENV === 'production'
      ? applyMiddleware(displayEmitter)
      : applyMiddleware(displayEmitter, createLogger());
  const persist = persistState(undefined, {
    serialize: serializeEditorState,
    deserialize: deserializePersistentString,
  });

  const enhancer = compose(
    middleware,
    persist,
  );
  return baseCreateStore(rootReducer, enhancer);
};
