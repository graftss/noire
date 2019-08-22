import * as React from 'react';
import * as T from '../../../types';

interface ComponentRemoveProps {
  component: T.SerializedComponent;
  removeComponent: (id: string) => void;
}

export const ComponentRemove: React.SFC<ComponentRemoveProps> = ({
  component,
  removeComponent,
}) => (
  <div>
    <button onClick={() => removeComponent(component.id)}>
      remove component
    </button>
  </div>
);
