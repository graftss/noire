import * as React from 'react';

import * as T from '../../types';
import { controllerKey } from '../../input/controllers';

interface ComponentBindingProps {
  controller: T.Controller;
  binding: T.Binding;
  remap: (b: T.ControllerBindingRelation) => void;
}

export const ComponentBindings: React.SFC<ComponentBindingProps> = ({
  controller,
  binding,
  remap,
}) => (
  <div>
    {(controllerKey(controller, binding) || []).map(relation => (
      <button key={relation.binding.id} onClick={() => remap(relation)}>
        {`${relation.displayName}: ${relation.controllerKey}`}
      </button>
    ))}
  </div>
);
