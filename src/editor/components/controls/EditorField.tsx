import * as React from 'react';
import * as T from '../../../types';
import { TextField } from './TextField';
import { BooleanField } from './BooleanField';
import { FloatField } from './FloatField';
import { Vec2Field } from './Vec2Field';

interface EditorFieldProps<V extends T.EditorFieldKind> {
  field: T.EditorField<V>;
  initialValue: Maybe<T.EditorFieldType<V>>;
  update: (value: T.EditorFieldType<V>) => void;
}

function renderFieldInput<V extends T.EditorFieldKind>({
  field,
  initialValue,
  update,
}: EditorFieldProps<V>): React.ReactNode {
  const props: any = {
    defaultValue: field.defaultValue,
    initialValue,
    update,
    ...field.props,
  };

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

export function EditorField<V extends T.EditorFieldKind>(
  props: EditorFieldProps<V>,
): JSX.Element {
  return (
    <div>
      <span>{props.field.label}: </span>
      {renderFieldInput(props)}
    </div>
  );
}
