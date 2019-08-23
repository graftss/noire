import * as React from 'react';
import * as T from '../../../types';
import { TextField } from '../controls/TextField';

interface DisplayEditorProps {
  display: Maybe<T.SerializedDisplay>;
  updateDisplayName: (display: T.SerializedDisplay, name: string) => void;
}

export const DisplayEditor: React.SFC<DisplayEditorProps> = ({
  display,
  updateDisplayName,
}) =>
  display === undefined ? null : (
    <div>
      <TextField
        defaultValue={display.name}
        update={name => updateDisplayName(display, name)}
      />
    </div>
  );
