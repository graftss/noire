import * as React from 'react';
import * as T from '../../../types';
import { TextField } from '../controls/TextField';

interface DisplayEditorProps {
  display: Maybe<T.SerializedDisplay>;
  exportDisplay: (display: T.SerializedDisplay) => void;
  updateDisplayName: (display: T.SerializedDisplay, name: string) => void;
}

export const DisplayEditor: React.SFC<DisplayEditorProps> = ({
  display,
  exportDisplay,
  updateDisplayName,
}) =>
  display === undefined ? null : (
    <div>
      display name:{' '}
      <div>
        <TextField
          defaultValue={display.name}
          update={name => updateDisplayName(display, name)}
        />
      </div>
      <div>
        <button onClick={() => exportDisplay(display)}>
          export to clipboard
        </button>
      </div>
    </div>
  );
