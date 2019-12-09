import * as T from '../../types';
import { mapPath } from '../../utils';
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
      ref: T.ComponentFilterRef;
      key: string;
    };

export interface InputState {
  controllers: T.Controller[];
  remap?: RemapState;
  selectedControllerId?: string;
}

export const initialInputState: InputState = {
  controllers: [],
};

export interface ControllerBindingUpdate {
  controllerId: string;
  key: string;
  binding: Maybe<T.Binding>;
}

const setControllerBinding = (key: string, binding: Maybe<T.Binding>) => (
  c: T.Controller,
): T.Controller => mapPath(['bindings', key], () => binding, c);

export const inputReducer = (
  state: InputState = initialInputState,
  action: T.EditorAction,
): InputState => {
  switch (action.type) {
    case 'addController':
      return {
        ...state,
        controllers: [...state.controllers, action.data],
        selectedControllerId: action.data.id,
      };

    case 'removeController':
      return {
        ...state,
        controllers: state.controllers.filter(c => c.id !== action.data),
        selectedControllerId:
          state.selectedControllerId === action.data
            ? undefined
            : state.selectedControllerId,
      };

    case 'selectController':
      return { ...state, selectedControllerId: action.data };

    case 'listenNextInput':
      return { ...state, remap: action.data };

    case 'stopListening':
      return { ...state, remap: undefined };

    case 'setControllerBinding': {
      const { controllerId, key, binding } = action.data;

      return mapControllerWithId.proj(state)(
        controllerId,
        setControllerBinding(key, binding),
      );
    }

    case 'setControllerName': {
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
