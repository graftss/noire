import * as React from 'react';
import * as T from '../../../types';
import { TextField } from '../controls/TextField';

interface ComponentStateProps {
  component: T.SerializedComponent;
  stateConfig: Maybe<T.ComponentEditorField[]>;
  update: (stateKey: string, value: any) => void;
}

const renderField = (
  component: T.SerializedComponent,
  update: (stateKey: string, value: any) => void,
  field: T.ComponentEditorField,
): React.ReactNode => {
  switch (field.kind) {
    case 'string': {
      const value: string = component.state[field.stateKey];

      return (
        <div>
          <span>{field.label}: </span>
          <TextField
            defaultValue={value}
            type="text"
            update={string => update(field.stateKey, string)}
          />
        </div>
      );
    }

    case 'number': {
      const value: number = component.state[field.stateKey];

      return (
        <div>
          <span>{field.label}: </span>
          <TextField
            defaultValue={value.toString()}
            type="number"
            update={number => update(field.stateKey, Number(number))}
          />
        </div>
      );
    }

    case 'boolean': {
      const value: boolean = component.state[field.stateKey];

      return (
        <div>
          <span>{field.label}: </span>
          <input
            type="checkbox"
            checked={value}
            onChange={() => update(field.stateKey, !value)}
          />
        </div>
      );
    }

    case 'Vec2': {
      const value: Vec2 = component.state[field.stateKey];

      return (
        <div>
          <span>{field.label}: </span>
          <TextField
            defaultValue={value.x.toString()}
            type="number"
            update={x => update(field.stateKey, { x: parseInt(x), y: value.y })}
          />
          <TextField
            defaultValue={value.y.toString()}
            type="number"
            update={y => update(field.stateKey, { x: value.x, y: parseInt(y) })}
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
        <div key={field.stateKey}>{renderField(component, update, field)}</div>
      ))}
    </div>
  );
