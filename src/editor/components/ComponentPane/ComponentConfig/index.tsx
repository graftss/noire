import * as React from 'react';
import * as T from '../../../../types';
import { componentEditorConfigs } from '../../../../canvas/component';
import { FixedField } from './FixedField';
import { KeysField } from './KeysField';

interface ComponentConfigProps {
  component: T.SerializedComponent;
}

export const ComponentConfig: React.SFC<ComponentConfigProps> = ({
  component,
}) => {
  const renderField = (field: T.ComponentEditorField): Maybe<JSX.Element> => {
    switch (field.kind) {
      case 'fixed':
        return <FixedField label={field.data.label} />;

      case 'keys': {
        return <KeysField component={component} keys={field.data.keys} />;
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
