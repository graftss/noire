import * as React from 'react';
import * as T from '../../../../types';
import {
  stringifyComponentKey,
  componentInputKinds,
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

const controllerKeyStr = (
  controllerKey: Maybe<T.ControllerKey>,
  controllersById: Dict<T.Controller>,
  listening: boolean,
): string => {
  if (listening) return '(listening...)';
  if (!controllerKey) return 'NONE';

  const { controllerId, key } = controllerKey;
  const controller: T.Controller = controllersById[controllerId];
  return stringifyControllerKey(controller, key);
};

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
      {keys.map(ck => (
        <div key={ck.key}>
          {stringifyComponentKey(ck)}
          <button
            onClick={() => listenNextInput(getRemapState(component, ck.key))}
          >
            {controllerKeyStr(
              component.state.inputMap[ck.key],
              controllersById,
              isListening(remapState, component.id, ck.key),
            )}
          </button>
        </div>
      ))}
    </div>
  );
};
