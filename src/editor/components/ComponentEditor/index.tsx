import * as React from 'react';
import * as T from '../../../types';
import { FixedField } from './FixedField';
import { BindingsField } from './BindingsField';

interface ComponentEditorProps {
  config: T.ComponentEditorConfig;
}

const renderField = (field: T.ComponentEditorField): React.SFCElement<{}> => {
  switch (field.kind) {
    case 'fixed':
      return <FixedField {...field.data} />;
    case 'slider':
      return <div>slider</div>;
    case 'bindings':
      return <BindingsField {...field.data} />;
  }
};

export const ComponentEditor: React.SFC<ComponentEditorProps> = ({
  config,
}) => (
  <div>
    {config.map((field, index) => (
      <div key={index}> {renderField(field)} </div>
    ))}
  </div>
);
