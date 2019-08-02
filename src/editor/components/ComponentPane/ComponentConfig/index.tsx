import * as React from 'react';
import * as T from '../../../../types';
import { getEditorConfig } from '../../../../canvas/component/editor';
import { ConfigTitle } from './ConfigTitle';
import { ConfigKeys } from './ConfigKeys';

interface ComponentConfigProps {
  component: T.SerializedComponent;
}

export const ComponentConfig: React.SFC<ComponentConfigProps> = ({
  component,
}) => {
  const { title, keys } = getEditorConfig(component.kind);

  return (
    <div>
      <ConfigTitle label={title} />
      <ConfigKeys component={component} keys={keys} />
    </div>
  );
};
