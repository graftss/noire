import * as React from 'react';
import * as T from '../../../../types';
import { stringifyComponentKey } from '../../../../canvas/component';
import { RemapButton } from '../../controls/RemapButton';

interface ConfigKeysProps {
  component: T.SerializedComponent;
  keys: T.ComponentKey[];
}

export const ConfigKeys: React.SFC<ConfigKeysProps> = ({ component, keys }) => {
  return (
    <div>
      {keys.map((componentKey: T.ComponentKey) => (
        <div key={componentKey.key}>
          {stringifyComponentKey(componentKey)}
          <RemapButton value={{ kind: 'component', component, componentKey }} />
        </div>
      ))}
    </div>
  );
};
