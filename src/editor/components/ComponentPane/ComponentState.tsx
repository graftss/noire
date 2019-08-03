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
  const value = component.state[field.stateKey];

  switch (field.kind) {
    case 'string': {
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
  }

  return null;
};

export const ComponentState: React.SFC<ComponentStateProps> = ({
  component,
  stateConfig,
  update,
}) =>
  stateConfig === undefined ? null : (
    <div>{stateConfig.map(field => renderField(component, update, field))}</div>
  );
