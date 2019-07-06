import * as React from 'react';

import { EditorState } from '../state/createStore';

export interface EditorProps {
  state: EditorState;
}

export const Editor: React.SFC<EditorProps> = (props: EditorProps) => (
  <div>hello {props.state.name}</div>
);
