import { combineReducers, Reducer } from 'redux';
import * as T from '../../types';
import { displayReducer } from './display';
import { inputReducer } from './input';
import { tabReducer } from './tab';

export interface EditorState {
  display: T.DisplayState;
  input: T.InputState;
  tab: T.TabState;
}

export const rootReducer: Reducer<
  EditorState,
  T.EditorAction
> = combineReducers({
  display: displayReducer,
  input: inputReducer,
  tab: tabReducer,
});
