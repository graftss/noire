import * as React from 'react';
import * as T from '../../../types';
import { getEditorConfig } from '../../../canvas/component/editor';
import { ComponentFilters } from './ComponentFilters';
import { ComponentKeys } from './ComponentKeys';
import { ComponentState } from './ComponentState';
import { ComponentTitle } from './ComponentTitle';

interface ComponentEditorProps {
  component: Maybe<T.SerializedComponent>;
  updateComponentState: (id: string, state: T.ComponentState) => void;
}

export const ComponentEditor: React.SFC<ComponentEditorProps> = ({
  component,
  updateComponentState,
}) => {
  if (!component) return null;
  const config = getEditorConfig(component.kind);

  return (
    <div>
      <ComponentTitle label={config.title} />
      <ComponentState
        component={component}
        stateConfig={config.state}
        update={(stateKey, value) => {
          const newState = { ...component.state, [stateKey]: value };
          updateComponentState(component.id, newState);
        }}
      />
      <ComponentKeys component={component} keys={config.keys} />
      <ComponentFilters component={component} />
    </div>
  );
};
