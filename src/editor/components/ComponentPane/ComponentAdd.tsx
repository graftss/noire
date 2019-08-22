import * as React from 'react';
import * as T from '../../../types';
import { ComponentKindSelect } from './ComponentKindSelect';

interface ComponentAddProps {
  addComponent: (kind: T.ComponentKind) => void;
}

export const ComponentAdd: React.SFC<ComponentAddProps> = ({
  addComponent,
}) => (
  <div>
    <ComponentKindSelect
      initialValue={undefined}
      handleSelection={addComponent}
    />
  </div>
);
