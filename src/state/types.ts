import { Store } from 'redux';

// TODO: clean this up
import * as T from '../canvas/types';

export interface DisplayState {
  bindings: T.BindingData[];
  components: T.SerializedComponent[];
  selectedComponentId?: string;
}

export interface EditorState {
  display: DisplayState;
}

export type EditorAction =
  | { type: 'addBinding'; data: T.BindingData }
  | { type: 'selectComponent'; data: string | undefined };

export type EditorStore = Store<EditorState, EditorAction>;
