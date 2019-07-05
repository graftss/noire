import { equals, max, reduce } from 'ramda';

import DisplayEventBus from './DisplayEventBus';
import * as T from '../types';
import * as M from '../gamepad/inputMaps';
import { find, mappedEval, uuid } from '../utils';

export type BindingId = string;

export type BindingData = {
  id?: BindingId,
  binding: T.Binding
};

const hasBinding = (binding: T.Binding) => (data: BindingData) => (
  equals(binding, data.binding)
);

const matchesId = (id: BindingId) => (data: BindingData) => data.id === id;
const findBindingWithId =
  (id, data: BindingData[]) => find(matchesId(id))(data).binding;

export default class BindingManager {
  constructor(
    private eventBus: DisplayEventBus,
    private bindingData: BindingData[] = [],
  ) {
    // TODO: sanity check initial binding list
    this.bindingData = bindingData;
  }

  public add(binding: T.Binding): BindingId {
    const data = find(hasBinding(binding))(this.bindingData);

    if (data) return data.id;

    const id = uuid();
    this.bindingData.push({ binding, id });
    return id;
  }

  private getBinding(id: BindingId): T.Binding {
    return findBindingWithId(id, this.bindingData);
  }

  private applyBinding(b: T.Binding, gamepad: Gamepad): T.Input | undefined {
    if (b) {
      switch (b.kind) {
        case 'axis': return {
          kind: 'axis',
          input: M.axisMap(b.binding)(gamepad),
        };

        case 'button': return {
          kind: 'button',
          input: M.buttonInputMap(b.binding)(gamepad),
        };

        case 'dpad': return {
          kind: 'dpad',
          input: M.dPadMap(b.binding)(gamepad),
        };

        case 'stick': return {
          kind: 'stick',
          input: M.stickMap(b.binding)(gamepad),
        };
      }
    }
  }

  public getInputDict(gamepad: Gamepad): { [id: number]: T.Input } {
    const result = {};

    this.bindingData.forEach(
      ({ id, binding }) => result[id] = this.applyBinding(binding, gamepad)
    );

    return result;
  }
}
