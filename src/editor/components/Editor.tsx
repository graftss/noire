import * as React from 'react';
import { EditorTabs } from './EditorTabs';
import { EditorRouter } from './EditorRouter';

export const Editor: React.SFC<{}> = () => (
  <div>
    <EditorTabs />
    <EditorRouter />
  </div>
);
