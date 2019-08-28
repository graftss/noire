import * as React from 'react';
import * as T from '../../../types';
import { TextField } from '../controls/TextField';
import { Vec2Field } from '../controls/Vec2Field';
import { ComponentKindSelect } from './ComponentKindSelect';

interface DisplayEditorProps {
  addComponent: CB1<T.ComponentKind>;
  display: Maybe<T.SerializedDisplay>;
  exportDisplay: CB1<T.SerializedDisplay>;
  importComponent: CB0;
  saveDisplay: CB1<T.SerializedDisplay>;
  setActiveDisplayDimensions: CB1<{ width: number; height: number }>;
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
  importComponent,
  saveDisplay,
  setActiveDisplayDimensions,
  setDisplayName,
}) =>
  display === undefined ? null : (
    <div>
      <div>
        <button onClick={() => exportDisplay(display)}>export display</button>
        <button onClick={() => saveDisplay(display)}>save display</button>
        <button onClick={importComponent}>import component</button>
      </div>{' '}
      <div>
        display name:
        <TextField defaultValue={display.name} update={setDisplayName} />
      </div>
      <div>
        {renderUnsetDimensionsWarning(display)}
        canvas size:{' '}
        <Vec2Field
          defaultValue={{ x: 0, y: 0 }}
          initialValue={{ x: display.width, y: display.height }}
          update={({ x, y }) =>
            setActiveDisplayDimensions({ width: x, height: y })
          }
        />
      </div>
      <div className="flex-container">
        <span className="center">add new component:</span>
        <span className="flex-rest">
          <ComponentKindSelect
            buttonText="add new component"
            initialValue={undefined}
            handleSelection={addComponent}
          />
        </span>
      </div>
    </div>
  );
