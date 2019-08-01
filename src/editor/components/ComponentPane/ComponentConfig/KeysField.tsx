import * as React from 'react';
import * as T from '../../../../types';
import {
  componentInputKinds,
  stringifyComponentKey,
  mappedControllerKey,
} from '../../../../canvas/component';
import { RemapButton } from '../../controls/RemapButton';

interface KeysFieldProps {
  component: T.SerializedComponent;
  keys: T.ComponentKey[];
}

const getRemapState = (
  component: T.SerializedComponent,
  key: string,
): T.RemapState => ({
  componentId: component.id,
  key,
  kind: 'component',
  inputKind: componentInputKinds[component.kind][key],
});

export const KeysField: React.SFC<KeysFieldProps> = ({ component, keys }) => {
  return (
    <div>
      {keys.map((ck: T.ComponentKey) => {
        return (
          <div key={ck.key}>
            {stringifyComponentKey(ck)}
            <RemapButton
              value={{
                kind: 'controllerKey',
                controllerKey: mappedControllerKey(component, ck),
              }}
              remapTo={getRemapState(component, ck.key)}
            />
          </div>
        );
      })}
    </div>
  );
};
