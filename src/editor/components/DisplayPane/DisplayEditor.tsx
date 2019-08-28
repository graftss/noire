import * as React from 'react';
import * as T from '../../../types';
import { TextField } from '../controls/TextField';
import { Vec2Field } from '../controls/Vec2Field';
import { ComponentKindSelect } from './ComponentKindSelect';

interface DisplayEditorProps {
  addComponent: CB1<T.ComponentKind>;
  display: Maybe<T.SerializedDisplay>;
  exportDisplay: CB1<T.SerializedDisplay>;
  saveDisplay: CB1<T.SerializedDisplay>;
  setCanvasDimensions: CB1<{ width: number; height: number }>;
  setDisplayName: CB1<string>;
}

export const renderUnsetDimensionsWarning = ({
  width,
  height,
}: T.SerializedDisplay): React.ReactNode =>
  !width || !height ? (
    <span>
      <b>set canvas dimensions!!! </b>
    </span>
  ) : null;

export const DisplayEditor: React.SFC<DisplayEditorProps> = ({
  addComponent,
  display,
  exportDisplay,
  saveDisplay,
  setCanvasDimensions,
  setDisplayName,
}) =>
  display === undefined ? null : (
    <div style={{ border: '3px solid blue' }}>
      display name:{' '}
      <div>
        <TextField defaultValue={display.name} update={setDisplayName} />
      </div>
      <div>
        <button onClick={() => exportDisplay(display)}>
          export to clipboard
        </button>
        <button onClick={() => saveDisplay(display)}>save display</button>
      </div>
      <div>
        {renderUnsetDimensionsWarning(display)}
        canvas size:{' '}
        <Vec2Field
          defaultValue={{ x: 0, y: 0 }}
          initialValue={{ x: display.width, y: display.height }}
          update={({ x, y }) => setCanvasDimensions({ width: x, height: y })}
        />
      </div>
      <div>
        <ComponentKindSelect
          buttonText="add new component"
          initialValue={undefined}
          handleSelection={addComponent}
        />
      </div>
    </div>
  );
