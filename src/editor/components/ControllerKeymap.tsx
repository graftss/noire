import * as React from 'react';
import { toPairs } from 'ramda';

import * as T from '../../types';
import { stringifyBinding } from '../../input/bindings';
import { stringifyControllerKey } from '../../input/controllers';

interface ControllerBindingsProps {
  controller: T.Controller;
}

const stringifyKeymap = (
  c: T.Controller,
  key: string,
  binding: T.Binding,
): string => `${stringifyControllerKey(c, key)}: ${stringifyBinding(binding)}`;

export const ControllerKeymap: React.SFC<ControllerBindingsProps> = ({
  controller,
}) => (
  <div>
    {toPairs(controller.map).map(([key, binding]) => (
      <div key={key}>
        <button>{stringifyKeymap(controller, key, binding)}</button>
      </div>
    ))}
  </div>
);
