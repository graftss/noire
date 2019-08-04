import * as React from 'react';
import * as T from '../../../types';
import { TextField } from '../controls/TextField';
import { BooleanField } from '../controls/BooleanField';
import { FloatField } from '../controls/FloatField';

interface ComponentStateProps {
  component: T.SerializedComponent;
  stateConfig: Maybe<T.StateEditorField[]>;
  update: (key: string, value: any) => void;
}

const renderField = (
  component: T.SerializedComponent,
  update: (EditorField: string, value: any) => void,
  field: T.StateEditorField,
): React.ReactNode => {
  switch (field.kind) {
    case 'string': {
      const value: string = component.state[field.key];

      return (
        <div>
          <span>{field.label}: </span>
          <TextField
            defaultValue={value}
            update={string => update(field.key, string)}
          />
        </div>
      );
    }

    case 'boolean': {
      const value: boolean = component.state[field.key];

      return (
        <div>
          <span>{field.label}: </span>
          <BooleanField
            defaultValue={value}
            update={boolean => update(field.key, boolean)}
          />
        </div>
      );
    }

    case 'number': {
      const value: number = component.state[field.key];

      return (
        <div>
          <span>{field.label}: </span>
          <FloatField
            defaultValue={value}
            precision={field.precision}
            update={number => update(field.key, number)}
          />
        </div>
      );
    }

    case 'Vec2': {
      const { x, y }: Vec2 = component.state[field.key];

      return (
        <div>
          <span>{field.label}: </span>
          <FloatField
            defaultValue={x}
            precision={field.precision}
            update={newX => update(field.key, { x: newX, y })}
          />
          <FloatField
            defaultValue={y}
            precision={field.precision}
            update={newY => update(field.key, { x, y: newY })}
          />
        </div>
      );
    }
  }

  return null;
};

export const ComponentState: React.SFC<ComponentStateProps> = ({
  component,
  stateConfig,
  update,
}) =>
  stateConfig === undefined ? null : (
    <div>
      {stateConfig.map(field => (
        <div key={field.key}>{renderField(component, update, field)}</div>
      ))}
    </div>
  );
