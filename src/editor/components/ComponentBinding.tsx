import * as React from 'react';

import * as T from '../../types';
import { controllerKey } from '../../input/controllers';

interface ComponentBindingProps {
  controller: T.Controller;
  binding: T.Binding;
}

export const ComponentBinding: React.SFC<ComponentBindingProps> = ({
  controller,
  binding,
}) => <div>{JSON.stringify(controllerKey(controller, binding))}</div>;
