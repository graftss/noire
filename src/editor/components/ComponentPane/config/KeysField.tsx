import * as React from 'react';
import * as T from '../../../../types';
import { stringifyComponentKey } from '../../../../canvas/component';
import { stringifyControllerKey } from '../../../../input/controller';

interface KeysFieldProps {
  component: T.SerializedComponent;
  keys: T.ComponentKey[];
  controllersById: Dict<T.Controller>;
}

const stringifyKey = (
  componentKey: T.ComponentKey,
  component: T.SerializedComponent,
  controllersById: Dict<T.Controller>,
): string => {
  const componentKeyStr = stringifyComponentKey(componentKey);
  const emptyStr = `${componentKeyStr}: NONE`;

  const { inputMap } = component.state;
  if (!inputMap) return emptyStr;

  const controllerKey: Maybe<T.ControllerKey> = inputMap[componentKey.key];
  if (!controllerKey) return emptyStr;

  const { controllerId, key } = controllerKey;
  const controller: T.Controller = controllersById[controllerId];
  return `${stringifyComponentKey(componentKey)}: ${stringifyControllerKey(
    controller,
    key,
  )}`;
};

export const KeysField: React.SFC<KeysFieldProps> = ({
  component,
  controllersById,
  keys,
}) => (
  <div>
    {keys.map(key => (
      <div key={key.key}>{stringifyKey(key, component, controllersById)}</div>
    ))}
  </div>
);
