import * as React from 'react';
import * as T from '../../../types';
import { ComponentName } from './ComponentName';
import { ComponentConfig } from './ComponentConfig';
import { ComponentFilters } from './ComponentFilters';

interface ComponentEditorProps {
  selected: Maybe<T.SerializedComponent>;
  updateComponentState: (id: string, state: T.ComponentState) => void;
}

export const ComponentEditor: React.SFC<ComponentEditorProps> = ({
  selected,
  updateComponentState,
}) =>
  selected ? (
    <div>
      <ComponentName
        initialName={selected.state && selected.state.name}
        save={name =>
          updateComponentState(selected.id, { ...selected.state, name })
        }
      />
      <ComponentConfig component={selected} />
      <ComponentFilters component={selected} />
    </div>
  ) : null;
