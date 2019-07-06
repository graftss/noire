import { Store } from 'redux';

export interface EditorState {
  name: string;
}

export interface EditorAction {
  type: 'setname';
  data: string;
}

export type EditorStore = Store<EditorState, EditorAction>;
