import { equals, max, reduce } from 'ramda';

import * as M from './inputMaps';
import { find, mappedEval, uuid } from '../utils';

export type BindingId = string;

export type BindingData = {
  id: BindingId,
  binding: M.Binding
};

const hasBinding = (binding: M.Binding) => (data: BindingData) => (
  equals(binding, data.binding)
);

const matchesId = (id: BindingId) => (data: BindingData) => data.id === id;
const findBindingWithId =
  (id, data: BindingData[]) => find(matchesId(id))(data).binding;

export default class BindingManager {
  bindingData: BindingData[];

  constructor(bindingData: BindingData[] = []) {
    // TODO: sanity check initial binding list
    this.bindingData = bindingData;
  }

  public add(binding: M.Binding): boolean {
    if (!find(hasBinding(binding))(this.bindingData)) {
      this.bindingData.push({ binding, id: uuid() });
      return true;
    }

    return false;
  }

  private getBinding(id: BindingId): M.Binding {
    return findBindingWithId(id, this.bindingData);
  }

  private applyBinding(b: M.Binding, gamepad: Gamepad): M.Input | undefined {
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

  public getInputDict(gamepad: Gamepad): { [id: number]: M.Input } {
    const result = {};

    this.bindingData.forEach(
      ({ id, binding }) => result[id] = this.applyBinding(binding, gamepad)
    );

    return result;
  }
}
