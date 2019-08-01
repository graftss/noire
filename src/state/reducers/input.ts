import * as T from '../../types';
import { mapIf, mapPath } from '../../utils';
import { testInitialState } from '../testInitialState';

export type RemapState =
  | {
      controllerId: string;
      fullUpdate?: boolean;
      inputKind: T.InputKind;
      key: string;
      kind: 'controller';
    }
  | {
      componentId: string;
      fullUpdate?: boolean;
      inputKind: T.InputKind;
      key: string;
      kind: 'component';
    }
  | {
      componentId: string;
      inputKind: T.InputKind;
      shape: string;
      filterIndex: number;
      filterKey: string;
      kind: 'filter';
    };

export interface InputState {
  remap: Maybe<RemapState>;
  controller: {
    all: T.Controller[];
    selectedId?: string;
  };
}

// const defaultInputState: InputState = {};
const defaultInputState = testInitialState.input;

export interface ControllerBindingsUpdate {
  controllerId: string;
  key: string;
  binding: Maybe<T.Binding>;
}

const setControllerBinding = (key: string, binding: Maybe<T.Binding>) => (
  c: T.Controller,
): T.Controller => mapPath(['bindings', key], () => binding, c);

const updateController = (
  state: InputState,
  id: string,
  f: (c: T.Controller) => T.Controller,
): InputState =>
  mapPath(
    ['controller', 'all'],
    (cs: T.Controller[]) => mapIf(cs, c => c.id === id, f),
    state,
  );

export const inputReducer = (
  state: InputState = defaultInputState,
  action: T.EditorAction,
): InputState => {
  switch (action.type) {
    case 'selectEditorOption': {
      return mapPath(
        ['controller', 'selectedId'],
        () => (action.data.kind === 'controller' ? action.data.id : undefined),
        state,
      );
    }

    case 'listenNextInput': {
      return { ...state, remap: action.data };
    }

    case 'stopListening': {
      return { ...state, remap: undefined };
    }

    case 'updateControllerBinding': {
      const { controllerId, key, binding } = action.data;

      return updateController(
        state,
        controllerId,
        setControllerBinding(key, binding),
      );
    }

    case 'updateControllerName': {
      const input = action.data.name;
      const name = input.length === 0 ? 'Unnamed controller' : input;

      return updateController(state, action.data.id, c => ({ ...c, name }));
    }
  }

  return state;
};
