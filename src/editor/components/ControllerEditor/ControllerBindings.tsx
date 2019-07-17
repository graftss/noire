import * as React from 'react';
import * as T from '../../../types';
import {
  stringifyControllerKey,
  getKeyInputKind,
} from '../../../input/controller';
import { stringifyBinding } from '../../../input/source';
import { getControllerMap } from '../../../input/controller';
import { keys } from 'ramda';

interface ControllerBindingsProps {
  controller: T.Controller;
  listenNextInput: (s: T.RemapState) => void;
}

const getRemapState = (
  controller: T.Controller,
  key: string,
): T.RemapState => ({
  kind: 'controller',
  controllerId: controller.id,
  key,
  inputKind: getKeyInputKind(controller.controllerKind, key),
});

export const ControllerBindings: React.SFC<ControllerBindingsProps> = ({
  controller,
  listenNextInput,
}) => (
  <div>
    {keys(getControllerMap(controller.controllerKind)).map(
      key => (
        <div key={key}>
          <span>{stringifyControllerKey(controller.controllerKind, key)} </span>
          <button
            onClick={() => listenNextInput(getRemapState(controller, key))}
          >
            {stringifyBinding(controller.sourceKind, controller.bindings[key])}
          </button>
        </div>
      ),
    )}
  </div>
);
