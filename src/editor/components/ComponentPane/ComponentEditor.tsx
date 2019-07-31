import * as React from 'react';
import * as T from '../../../types';
import { ComponentName } from './ComponentName';
import { ComponentConfig } from './ComponentConfig';

interface ComponentEditorProps {
  controllersById: Dict<T.Controller>;
  listenNextInput: (s: T.RemapState) => void;
  remapState: Maybe<T.RemapState>;
  selected: Maybe<T.SerializedComponent>;
  updateComponentState: (id: string, state: T.ComponentState) => void;
}

export const ComponentEditor: React.SFC<ComponentEditorProps> = ({
  controllersById,
  listenNextInput,
  remapState,
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
      <ComponentConfig
        component={selected}
        controllersById={controllersById}
        listenNextInput={listenNextInput}
        remapState={remapState}
      />
    </div>
  ) : null;
