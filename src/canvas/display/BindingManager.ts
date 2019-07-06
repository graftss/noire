import { equals } from 'ramda';

import * as T from '../types';
import * as M from '../gamepad/inputMaps';
import { DisplayEventBus } from './DisplayEventBus';
import { find, uuid } from '../../utils';

const hasBinding = (binding: T.Binding) => (data: T.BindingData) =>
  equals(binding, data.binding);

const matchesId = (id: T.BindingId) => (data: T.BindingData) => data.id === id;
const findBindingWithId = (id, data: T.BindingData[]): T.Binding =>
  find(matchesId(id))(data).binding;

export const applyBinding = (
  b: T.Binding,
  gamepad: Gamepad,
): T.Input | undefined => {
  switch (b.kind) {
    case 'axis':
      return {
        kind: 'axis',
        input: M.axisMap(b.binding)(gamepad),
      };

    case 'button':
      return {
        kind: 'button',
        input: M.buttonInputMap(b.binding)(gamepad),
      };

    case 'dpad':
      return {
        kind: 'dpad',
        input: M.dPadMap(b.binding)(gamepad),
      };

    case 'stick':
      return {
        kind: 'stick',
        input: M.stickMap(b.binding)(gamepad),
      };
  }
};

export class BindingManager {
  constructor(
    private eventBus: DisplayEventBus,
    private bindingData: T.BindingData[] = [],
  ) {
    // TODO: sanity check initial binding list
    this.bindingData = bindingData;
  }

  add(binding: T.Binding): T.BindingId {
    const data = find(hasBinding(binding))(this.bindingData);

    if (data) return data.id;

    const id = uuid();
    this.bindingData.push({ binding, id });
    return id;
  }

  private getBinding(id: T.BindingId): T.Binding {
    return findBindingWithId(id, this.bindingData);
  }
}
