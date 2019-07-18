import * as React from 'react';
import * as T from '../../../types';
import { componentEditorConfigs } from '../../../canvas/component';
import { FixedField, KeysField } from './config';

interface ComponentConfigProps {
  component: T.SerializedComponent;
  controllersById: Dict<T.Controller>;
  listenNextInput: (s: T.RemapState) => void;
}

export const ComponentConfig: React.SFC<ComponentConfigProps> = ({
  component,
  controllersById,
  listenNextInput,
}) => {
  const renderField = (field: T.ComponentEditorField): Maybe<JSX.Element> => {
    switch (field.kind) {
      case 'fixed':
        return <FixedField label={field.data.label} />;

      case 'keys': {
        return (
          <KeysField
            component={component}
            controllersById={controllersById}
            keys={field.data.keys}
            listenNextInput={listenNextInput}
          />
        );
      }
    }
  };

  return (
    <div>
      {componentEditorConfigs[component.kind].map((field, i) => (
        <div key={i}>{renderField(field)}</div>
      ))}
    </div>
  );
};
