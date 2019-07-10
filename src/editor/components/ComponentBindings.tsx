import * as React from 'react';

import * as T from '../../types';

interface ComponentBindingProps {
  controller: T.Controller;
  binding: T.Binding;
  remap: (b: T.ControllerBindingRelation) => void;
}

export const ComponentBindings: React.SFC<ComponentBindingProps> = ({
  controller,
  binding,
  remap,
}) => <div></div>;
