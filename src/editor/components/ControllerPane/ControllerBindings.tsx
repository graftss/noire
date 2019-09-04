import * as React from 'react';
import * as T from '../../../types';
import { getControllerKeyOrder, getKeyName } from '../../../input/controller';
import { RemapButtonList } from '../controls/RemapButtonList';

interface ControllerBindingsProps {
  controller: T.Controller;
}

export const ControllerBindings: React.SFC<ControllerBindingsProps> = ({
  controller,
}) => (
  <div>
    <RemapButtonList
      data={getControllerKeyOrder(controller.kind).map(key => ({
        label: getKeyName(controller.kind, key),
        value: { kind: 'controller', controller, key },
      }))}
    />
  </div>
);
