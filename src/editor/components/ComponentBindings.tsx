import * as React from 'react';

import * as T from '../../types';
import { controllerKey } from '../../input/controllers';

interface ComponentBindingProps {
  controller: T.Controller;
  binding: T.Binding;
  remap: (b: T.ControllerKeyBinding) => void;
}

export const ComponentBindings: React.SFC<ComponentBindingProps> = ({
  controller,
  binding,
  remap,
}) => (
  <div>
    {(controllerKey(controller, binding) || []).map(
      (binding: T.ControllerKeyBinding, i) => (
        <button key={i} onClick={() => remap(binding)}>
          {`${binding[2]}: ${binding[0]}`}
        </button>
      ),
    )}
  </div>
);
