import * as React from 'react';
import * as T from '../../../types';
import { stringifyComponentKey } from '../../../display/component';
import { RemapButton } from '../controls/RemapButton';

interface ComponentKeysProps {
  component: T.SerializedComponent;
  keys: T.ComponentKey[];
}

export const ComponentKeys: React.SFC<ComponentKeysProps> = ({
  component,
  keys,
}) => {
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
