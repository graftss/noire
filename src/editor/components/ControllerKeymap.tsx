import * as React from 'react';
import * as T from '../../types';
import { stringifyBinding } from '../../input/bindings';
import { controllerData, controllerKeyNames } from '../../input/keymaps';

interface ControllerBindingsProps {
  controller: T.Controller;
  listenNextInput: (s: T.RemapState) => void;
  remapState: T.RemapState;
}

const stringifyKeymap = (
  c: T.Controller,
  key: string,
  binding: Maybe<T.Binding>,
  listened: boolean,
): string => {
  return `${controllerData[c.kind][key].name}: ${stringifyBinding(
    binding,
    listened,
  )}`;
};

const generateRemapState = (c: T.Controller, key: string): T.RemapState => ({
  kind: 'controller',
  controllerId: c.id,
  key,
  inputKind: controllerData[c.kind][key].inputKind,
});

const isRemappingControllerKey = (
  remapState: T.RemapState,
  controller: T.Controller,
  key: string,
): boolean =>
  remapState &&
  remapState.kind === 'controller' &&
  remapState.controllerId === controller.id &&
  remapState.key === key;

export const ControllerKeymap: React.SFC<ControllerBindingsProps> = ({
  controller,
  listenNextInput,
  remapState,
}) => (
  <div>
    {controllerKeyNames[controller.kind].map(
      (key: keyof T.GamepadMap['map']) => (
        <div key={key}>
          <button
            onClick={() => listenNextInput(generateRemapState(controller, key))}
          >
            {stringifyKeymap(
              controller,
              key,
              controller.map[key],
              isRemappingControllerKey(remapState, controller, key),
            )}
          </button>
        </div>
      ),
    )}
  </div>
);
