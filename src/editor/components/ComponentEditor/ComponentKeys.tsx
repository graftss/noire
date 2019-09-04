import * as React from 'react';
import * as T from '../../../types';
import { stringifyComponentKey } from '../../../display/component';
import { RemapButtonList } from '../controls/RemapButtonList';
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
      <RemapButtonList
        data={keys.map(componentKey => ({
          label: stringifyComponentKey(componentKey),
          value: { kind: 'component', component, componentKey },
        }))}
      />
    </Section>
  );
};
