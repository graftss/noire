import { combineReducers, Reducer } from 'redux';

import { displayReducer } from './displayReducer';
import { EditorAction, EditorState } from '../types';

export const reducer: Reducer<EditorState, EditorAction> = combineReducers({
  display: displayReducer,
});
