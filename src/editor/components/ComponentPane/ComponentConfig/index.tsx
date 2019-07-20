import * as React from 'react';
import * as T from '../../../../types';
import { componentEditorConfigs } from '../../../../canvas/component';
import { FixedField } from './FixedField';
import { KeysField } from './KeysField';

interface ComponentConfigProps {
  component: T.SerializedComponent;
  controllersById: Dict<T.Controller>;
  listenNextInput: (s: T.RemapState) => void;
  remapState: Maybe<T.RemapState>;
}

export const ComponentConfig: React.SFC<ComponentConfigProps> = ({
  component,
  controllersById,
  listenNextInput,
  remapState,
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
            remapState={remapState}
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
