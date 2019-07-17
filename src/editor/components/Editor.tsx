import * as React from 'react';
import { ControllerPane } from './ControllerPane';

interface EditorProps {}

export const Editor: React.SFC<EditorProps> = ({}) => (
  <div>
    editor
    <ControllerPane />
  </div>
);
