import * as React from 'react';
import * as T from '../../../types';
import { ComponentName } from './ComponentName';

interface ComponentEditorProps {
  selected: Maybe<T.SerializedComponent>;
  updateComponentName: (id: string, name: string) => void;
}

export const ComponentEditor: React.SFC<ComponentEditorProps> = ({
  selected,
  updateComponentName,
}) =>  selected ? (
  <div>
    <ComponentName
      initialName={selected.name}
      save={name => updateComponentName(selected.id, name)}
    />
  </div>
) : null;
