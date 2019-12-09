import { combineReducers, Reducer } from 'redux';
import * as T from '../../types';
import { displayReducer } from './display';
import { inputReducer } from './input';
import { localReducer } from './local';
import { presentationReducer } from './presentation';
import { savedDisplaysReducer } from './savedDisplays';
import { tabReducer } from './tab';

export interface EditorState {
  display: T.DisplayState;
  input: T.InputState;
  local: T.LocalState;
  presentation: T.PresentationState;
  savedDisplays: T.SavedDisplaysState;
  tab: T.TabState;
}

export const rootReducer: Reducer<
  EditorState,
  T.EditorAction
> = combineReducers({
  display: displayReducer,
  input: inputReducer,
  local: localReducer,
  presentation: presentationReducer,
  savedDisplays: savedDisplaysReducer,
  tab: tabReducer,
});
