import * as React from 'react';
import * as T from '../../../../types';
import { stringifyComponentKey } from '../../../../canvas/component';
import { RemapButton } from '../../controls/RemapButton';

interface KeysFieldProps {
  component: T.SerializedComponent;
  keys: T.ComponentKey[];
}

export const KeysField: React.SFC<KeysFieldProps> = ({ component, keys }) => {
  return (
    <div>
      {keys.map((componentKey: T.ComponentKey) => {
        return (
          <div key={componentKey.key}>
            {stringifyComponentKey(componentKey)}
            <RemapButton
              value={{
                kind: 'component',
                component,
                componentKey,
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
