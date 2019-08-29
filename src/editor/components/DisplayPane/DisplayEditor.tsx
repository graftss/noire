import * as React from 'react';
import * as T from '../../../types';
import { ComponentKindSelect } from './ComponentKindSelect';
import { DisplayFields } from './DisplayFields';

interface DisplayEditorProps {
  addComponent: CB1<T.ComponentKind>;
  display: Maybe<T.SerializedDisplay>;
  exportDisplay: CB1<T.SerializedDisplay>;
  importComponent: CB0;
  saveDisplay: CB1<T.SerializedDisplay>;
  updateDisplayField: CB1<{
    display: T.SerializedDisplay;
    field: T.DisplayField;
  }>;
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
  updateDisplayField,
}) =>
  display === undefined ? null : (
    <div>
      <div>
        <button onClick={() => exportDisplay(display)}>export display</button>
        <button onClick={() => saveDisplay(display)}>save display</button>
        <button onClick={importComponent}>import component</button>
      </div>{' '}
      <DisplayFields display={display} update={updateDisplayField} />
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
