import * as T from '../../types';
import { mapIf, mapPath } from '../../utils';
import { testInitialState } from '../testInitialState';

export type RemapState =
  | {
      kind: 'controller';
      inputKind: T.InputKind;
      controllerId: string;
      fullUpdate?: boolean;
      key: string;
    }
  | {
      kind: 'component';
      inputKind: T.InputKind;
      componentId: string;
      fullUpdate?: boolean;
      key: string;
    }
  | {
      kind: 'filter';
      inputKind: T.InputKind;
      componentId: string;
      componentFilterKey: T.ComponentFilterKey;
    };

export interface InputState {
  remap: Maybe<RemapState>;
  controllers: T.Controller[];
  selectedControllerId?: string;
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

    case 'setTab': {
      const shouldAutoSelect =
        action.data === 'controllers' &&
        state.controllers.length > 0 &&
        state.selectedControllerId === undefined;

      return shouldAutoSelect
        ? { ...state, selectedControllerId: state.controllers[0].id }
        : state;
    }
  }

  return state;
};
