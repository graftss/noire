import * as React from 'react';
import { ControllerEditor } from './ControllerEditor';

interface EditorProps {}

export const Editor: React.SFC<EditorProps> = ({}) => (
  <div>
    editor
    <ControllerEditor />
  </div>
);
