import { combineReducers, Reducer } from 'redux';

import * as T from '../../types';
import { displayReducer } from './display';

export interface EditorState {
  display: T.DisplayState;
}

export const rootReducer: Reducer<
  EditorState,
  T.EditorAction
> = combineReducers({
  display: displayReducer,
});
