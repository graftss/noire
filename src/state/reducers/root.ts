import { combineReducers, Reducer } from 'redux';
import * as T from '../../types';
import { displayReducer } from './display';
import { inputReducer } from './input';

export interface EditorState {
  display: T.DisplayState;
  input: T.InputState;
}

export const rootReducer: Reducer<
  EditorState,
  T.EditorAction
> = combineReducers({
  display: displayReducer,
  input: inputReducer,
});
