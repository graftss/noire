import * as React from 'react';
import * as T from '../../../../types';
import {
  componentInputKinds,
  stringifyComponentKey,
  mappedControllerKey,
} from '../../../../canvas/component';
import { stringifyControllerKey } from '../../../../input/controller';

interface KeysFieldProps {
  component: T.SerializedComponent;
  controllersById: Dict<T.Controller>;
  keys: T.ComponentKey[];
  listenNextInput: (s: T.RemapState) => void;
  remapState: Maybe<T.RemapState>;
}

const isListening = (
  remapState: Maybe<T.RemapState>,
  componentId: string,
  componentKey: string,
): boolean =>
  remapState !== undefined &&
  remapState.kind === 'component' &&
  remapState.componentId === componentId &&
  remapState.key === componentKey;

const getRemapState = (
  component: T.SerializedComponent,
  key: string,
): T.RemapState => ({
  componentId: component.id,
  key,
  kind: 'component',
  inputKind: componentInputKinds[component.kind][key],
});

export const KeysField: React.SFC<KeysFieldProps> = ({
  component,
  controllersById,
  keys,
  listenNextInput,
  remapState,
}) => {
  return (
    <div>
      {keys.map((ck: T.ComponentKey) => {
        const controllerKey = mappedControllerKey(component, ck);
        const controller: Maybe<T.Controller> =
          controllerKey !== undefined
            ? controllersById[controllerKey.controllerId]
            : undefined;
        const key = controllerKey !== undefined ? controllerKey.key : undefined;

        return (
          <div key={ck.key}>
            <div>
              {stringifyComponentKey(ck)}
              <button
                onClick={() =>
                  listenNextInput(getRemapState(component, ck.key))
                }
              >
                {stringifyControllerKey(
                  controller,
                  key,
                  isListening(remapState, component.id, ck.key),
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
