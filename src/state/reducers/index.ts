import { combineReducers, Reducer } from 'redux';

import * as T from '../../types';
import { displayReducer } from './displayReducer';

export const reducer: Reducer<T.EditorState, T.EditorAction> = combineReducers({
  display: displayReducer,
});
