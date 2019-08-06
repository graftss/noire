import * as T from '../../types';
import { mapPath } from '../../utils';
import { testInitialState } from '../testInitialState';
import { mapControllerWithId } from '../maps';

export type RemapState =
  | {
      kind: 'controller';
      inputKind: T.InputKind;
      controllerId: string;
      key: string;
    }
  | {
      kind: 'component';
      inputKind: T.InputKind;
      componentId: string;
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

export interface ControllerBindingUpdate {
  controllerId: string;
  key: string;
  binding: Maybe<T.Binding>;
}

const setControllerBinding = (key: string, binding: Maybe<T.Binding>) => (
  c: T.Controller,
): T.Controller => mapPath(['bindings', key], () => binding, c);

export const inputReducer = (
  state: InputState = defaultInputState,
  action: T.EditorAction,
): InputState => {
  switch (action.type) {
    case 'selectController': {
      return { ...state, selectedControllerId: action.data };
    }

    case 'listenNextInput': {
      return { ...state, remap: action.data };
    }

    case 'stopListening': {
      return { ...state, remap: undefined };
    }

    case 'updateControllerBinding': {
      const { controllerId, key, binding } = action.data;

      return mapControllerWithId.proj(state)(
        controllerId,
        setControllerBinding(key, binding),
      );
    }

    case 'updateControllerName': {
      const input = action.data.name;
      const name = input.length === 0 ? 'Unnamed controller' : input;

      return mapControllerWithId.proj(state)(action.data.id, c => ({
        ...c,
        name,
      }));
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
