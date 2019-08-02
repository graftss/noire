import * as React from 'react';
import * as T from '../../../types';
import { getEditorConfig } from '../../../canvas/component/editor';
import { ComponentFilters } from './ComponentFilters';
import { ComponentKeys } from './ComponentKeys';
import { ComponentName } from './ComponentName';
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
  const { title, keys } = getEditorConfig(component.kind);

  return (
    <div>
      <ComponentName
        initialName={component.state && component.state.name}
        save={name =>
          updateComponentState(component.id, { ...component.state, name })
        }
      />
      <ComponentTitle label={title} />
      <ComponentKeys component={component} keys={keys} />
      <ComponentFilters component={component} />
    </div>
  );
};
