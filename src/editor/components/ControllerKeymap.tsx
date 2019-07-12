import * as React from 'react';
import { toPairs } from 'ramda';

import * as T from '../../types';
import { stringifyBinding } from '../../input/bindings';
import { stringifyControllerKey } from '../../input/controllers';

interface ControllerBindingsProps {
  controller: T.Controller;
  listenNextInput: (s: T.RemapState) => void;
  remapState: T.RemapState;
}

const stringifyKeymap = (
  c: T.Controller,
  key: string,
  binding: T.Binding,
  listened: boolean,
): string =>
  listened
    ? `${stringifyControllerKey(c, key)}: (listening)`
    : `${stringifyControllerKey(c, key)}: ${stringifyBinding(binding)}`;

const generateRemapState = (
  c: T.Controller,
  key: string,
  binding: T.Binding,
): T.RemapState => ({
  kind: 'controller',
  controllerId: c.id,
  key,
  bindingKind: binding.kind,
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
    {toPairs(controller.map).map(([key, binding]) => (
      <div key={key}>
        <button
          onClick={() =>
            listenNextInput(generateRemapState(controller, key, binding))
          }
        >
          {stringifyKeymap(
            controller,
            key,
            binding,
            isRemappingControllerKey(remapState, controller, key),
          )}
        </button>
      </div>
    ))}
  </div>
);
