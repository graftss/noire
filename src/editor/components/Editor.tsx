import * as React from 'react';

import { EditorState } from '../../state/types';

export interface EditorProps {
  state: EditorState;
}

export const Editor: React.SFC<EditorProps> = (props: EditorProps) => (
  <div>hello {JSON.stringify(props.state.display)}</div>
);
