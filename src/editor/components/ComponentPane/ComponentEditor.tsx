import * as React from 'react';
import * as T from '../../../types';
import { getComponentEditorConfig } from '../../../display/editor';
import { ComponentFilters } from './ComponentFilters';
import { ComponentKeys } from './ComponentKeys';
import { ComponentState } from './ComponentState';
import { ComponentShapes } from './ComponentShapes';
import { ComponentTitle } from './ComponentTitle';

interface ComponentEditorProps {
  component: Maybe<T.SerializedComponent>;
  updateComponentState: (id: string, state: T.ComponentState) => void;
  updateComponentShape: (
    component: T.SerializedComponent,
    shapeName: string,
    key: string,
    value: any,
  ) => void;
}

export const ComponentEditor: React.SFC<ComponentEditorProps> = ({
  component,
  updateComponentState,
  updateComponentShape,
}) => {
  if (!component) return null;
  const config = getComponentEditorConfig(component.kind);

  return (
    <div>
      <ComponentTitle label={config.title} />
      <ComponentState
        component={component}
        stateConfig={config.state}
        update={(EditorField, value) => {
          const newState = {
            ...component.state,
            [EditorField]: value,
          };
          updateComponentState(component.id, newState);
        }}
      />
      <ComponentKeys component={component} keys={config.keys} />
      <ComponentShapes
        component={component}
        shapeList={config.shapes}
        updateComponentShape={updateComponentShape}
      />
      <ComponentFilters component={component} />
    </div>
  );
};
