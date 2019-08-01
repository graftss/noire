import * as React from 'react';
import * as T from '../../../types';
import {
  stringifyKeyInController,
  getKeyInputKind,
} from '../../../input/controller';
import { getControllerKeyOrder } from '../../../input/controller';
import { RemapButton } from '../controls/RemapButton';

interface ControllerBindingsProps {
  controller: T.Controller;
}

const getRemapState = (
  controller: T.Controller,
  key: string,
): T.RemapState => ({
  kind: 'controller',
  controllerId: controller.id,
  key,
  inputKind: getKeyInputKind(controller.kind, key),
});

export const ControllerBindings: React.SFC<ControllerBindingsProps> = ({
  controller,
}) => (
  <div>
    {getControllerKeyOrder(controller.kind).map(key => (
      <div key={key}>
        <span>{stringifyKeyInController(controller, key)} </span>
        <RemapButton
          remapTo={getRemapState(controller, key)}
          value={{
            kind: 'binding',
            binding: controller.bindings[key],
          }}
        />
      </div>
    ))}
  </div>
);
