import * as React from 'react';
import * as T from '../../../types';
import { ComponentName } from './ComponentName';
import { ComponentConfig } from './ComponentConfig';
import { ComponentFilters } from './ComponentFilters';

interface ComponentEditorProps {
  component: Maybe<T.SerializedComponent>;
  updateComponentState: (id: string, state: T.ComponentState) => void;
}

export const ComponentEditor: React.SFC<ComponentEditorProps> = ({
  component,
  updateComponentState,
}) =>
  !component ? null : (
    <div>
      <ComponentName
        initialName={component.state && component.state.name}
        save={name =>
          updateComponentState(component.id, { ...component.state, name })
        }
      />
      <ComponentConfig component={component} />
      <ComponentFilters component={component} />
    </div>
  );
