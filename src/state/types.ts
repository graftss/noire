import { Store } from 'redux';

// TODO: clean this up
import * as T from '../canvas/types';

export interface DisplayState {
  bindings: T.BindingData[];
  components: T.SerializedComponent[];
}

export interface EditorState {
  display: DisplayState;
}

export interface EditorAction {
  type: 'addBinding';
  data: T.BindingData;
}

export type EditorStore = Store<EditorState, EditorAction>;
