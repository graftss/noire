import * as React from 'react';
import * as T from '../../../types';
import { EditorField } from '../controls/EditorField';
import { getDisplayFields } from '../../../display/serialize';

interface DisplayFieldsProps {
  display: T.SerializedDisplay;
  update: CB1<{ display: T.SerializedDisplay; field: T.DisplayField }>;
}

const fields = getDisplayFields();

export const DisplayFields: React.SFC<DisplayFieldsProps> = ({
  display,
  update,
}) => (
  <div>
    {fields.map(field => (
      <div key={field.key}>
        <EditorField
          initialValue={field.getter(display)}
          field={field}
          update={value =>
            update({
              display: field.setter(display, value),
              field,
            })
          }
        />
      </div>
    ))}
  </div>
);
