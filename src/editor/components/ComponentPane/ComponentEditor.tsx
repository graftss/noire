import * as React from 'react';
import * as T from '../../../types';
import { ComponentName } from './ComponentName';
import { ComponentConfig } from './ComponentConfig';

interface ComponentEditorProps {
  controllersById: Dict<T.Controller>;
  listenNextInput: (s: T.RemapState) => void;
  remapState: Maybe<T.RemapState>;
  selected: Maybe<T.SerializedComponent>;
  updateComponentName: (id: string, name: string) => void;
}

export const ComponentEditor: React.SFC<ComponentEditorProps> = ({
  controllersById,
  listenNextInput,
  remapState,
  selected,
  updateComponentName,
}) =>
  selected ? (
    <div>
      <ComponentName
        initialName={selected.name}
        save={name => updateComponentName(selected.id, name)}
      />
      <ComponentConfig
        component={selected}
        controllersById={controllersById}
        listenNextInput={listenNextInput}
        remapState={remapState}
      />
    </div>
  ) : null;
