import * as React from 'react';
import * as T from '../../../types';
import { InputWithDefault } from '../controls/InputWithDefault';

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
          <InputWithDefault
            defaultValue={value}
            update={string => update(field.stateKey, string)}
          />
        </div>
      );
    }

    case 'Vec2': {
      const value: Vec2 = component.state[field.stateKey];

      return (
        <div>
          <span>{field.label}: </span>
          <InputWithDefault
            defaultValue={value.x.toString()}
            update={x => update(field.stateKey, { x: parseInt(x), y: value.y })}
          />
          <InputWithDefault
            defaultValue={value.y.toString()}
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
