import * as React from 'react';
import * as T from '../../../types';
import { TextField } from './TextField';
import { BooleanField } from './BooleanField';
import { FloatField } from './FloatField';
import { Vec2Field } from './Vec2Field';

interface EditorFieldProps<V> {
  field: T.StateEditorField;
  defaultValue: V;
  update: (value: V) => void;
}

function renderFieldInput<V>({
  field,
  defaultValue,
  update,
}: EditorFieldProps<typeof field.kind>): React.ReactNode {
  const props = { defaultValue, update, ...field.props };

  switch (field.kind) {
    case 'string':
      return <TextField {...props} />;
    case 'boolean':
      return <BooleanField {...props} />;
    case 'number':
      return <FloatField {...props} />;
    case 'Vec2':
      return <Vec2Field {...props} />;
  }
}

export function EditorField<V>(props: EditorFieldProps<V>): JSX.Element {
  return (
    <div>
      <span>{props.field.label}: </span>
      {renderFieldInput(props)}
    </div>
  );
}
