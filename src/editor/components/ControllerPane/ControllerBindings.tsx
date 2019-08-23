import * as React from 'react';
import * as T from '../../../types';
import { getControllerKeyOrder, getKeyName } from '../../../input/controller';
import { RemapButton } from '../controls/RemapButton';

interface ControllerBindingsProps {
  controller: T.Controller;
}

export const ControllerBindings: React.SFC<ControllerBindingsProps> = ({
  controller,
}) => (
  <div>
    {getControllerKeyOrder(controller.kind).map(key => (
      <div key={key}>
        <span>{getKeyName(controller.kind, key)} </span>
        <RemapButton value={{ kind: 'controller', controller, key }} />
      </div>
    ))}
  </div>
);
