import * as React from 'react';
import * as T from '../../../types';
import { FixedField } from './FixedField';

interface ComponentEditorProps {
  component: T.SerializedComponent;
  config: T.ComponentEditorConfig;
}

const renderField = (field: T.ComponentEditorField): React.SFCElement<{}> => {
  switch (field.kind) {
    case 'fixed':
      return <FixedField {...field.data} />;
    case 'slider':
      return <div>slider</div>;
  }
};

export const ComponentEditor: React.SFC<ComponentEditorProps> = ({
  component,
  config,
}) => (
  <div>
    {config.map(field => (
      <div key={component.id}>{renderField(field)}</div>
    ))}
  </div>
);
