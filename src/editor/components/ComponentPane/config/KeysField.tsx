import * as React from 'react';
import * as T from '../../../../types';
import { stringifyComponentKey } from '../../../../canvas/component';
import {
  getKeyInputKind,
  stringifyControllerKey,
} from '../../../../input/controller';

interface KeysFieldProps {
  component: T.SerializedComponent;
  controllersById: Dict<T.Controller>;
  keys: T.ComponentKey[];
  listenNextInput: (s: T.RemapState) => void;
}

const controllerKeyStr = (
  controllerKey: Maybe<T.ControllerKey>,
  controllersById: Dict<T.Controller>,
): string => {
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
  inputKind: component.inputKinds[key],
});

export const KeysField: React.SFC<KeysFieldProps> = ({
  component,
  controllersById,
  keys,
  listenNextInput,
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
            )}
          </button>
        </div>
      ))}
    </div>
  );
};
