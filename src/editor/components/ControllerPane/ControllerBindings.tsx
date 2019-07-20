import * as React from 'react';
import * as T from '../../../types';
import {
  stringifyControllerKey,
  getKeyInputKind,
} from '../../../input/controller';
import { stringifyBinding } from '../../../input/source/bindings';
import { getControllerKeyOrder } from '../../../input/controller';

interface ControllerBindingsProps {
  controller: T.Controller;
  listenNextInput: (s: T.RemapState) => void;
  remapState: Maybe<T.RemapState>;
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

const isListening = (
  remapState: Maybe<T.RemapState>,
  controllerId: string,
  controllerKey: string,
): boolean =>
  remapState !== undefined &&
  remapState.kind === 'controller' &&
  remapState.controllerId === controllerId &&
  remapState.key === controllerKey;

const bindingStr = (binding: Maybe<T.Binding>, listening: boolean): string =>
  listening ? '(listening...)' : stringifyBinding(binding);

export const ControllerBindings: React.SFC<ControllerBindingsProps> = ({
  controller,
  listenNextInput,
  remapState,
}) => (
  <div>
    {getControllerKeyOrder(controller.kind).map(key => (
      <div key={key}>
        <span>{stringifyControllerKey(controller, key)} </span>
        <button onClick={() => listenNextInput(getRemapState(controller, key))}>
          {bindingStr(
            controller.bindings[key],
            isListening(remapState, controller.id, key),
          )}
        </button>
      </div>
    ))}
  </div>
);
