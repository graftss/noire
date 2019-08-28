import * as React from 'react';
import * as T from '../../../types';
import { stringifyComponentKey } from '../../../display/component';
import { RemapButton } from '../controls/RemapButton';
import { Section } from '../layout/Section';

interface ComponentKeysProps {
  component: T.SerializedComponent;
  keys: T.ComponentKey[];
}

export const ComponentKeys: React.SFC<ComponentKeysProps> = ({
  component,
  keys,
}) => {
  return keys.length === 0 ? null : (
    <Section>
      {keys.map((componentKey: T.ComponentKey) => (
        <div key={componentKey.key}>
          {stringifyComponentKey(componentKey)}
          <RemapButton value={{ kind: 'component', component, componentKey }} />
        </div>
      ))}
    </Section>
  );
};
