import * as T from '../../types';
import { mapIf, mapPath, withoutKey } from '../../utils';
import { testInitialState } from '../testInitialState';
import { hasKeyBoundTo } from '../../input/controller';

export type RemapState =
  | {
      kind: 'controller';
      controllerId: string;
      key: string;
      inputKind: T.InputKind;
    }
  | {
      kind: 'component';
      componentId: string;
      inputKind: T.InputKind;
      key: string;
    };

export interface InputState {
  selectedGamepadIndex?: number;
  remap?: RemapState;
  controller: {
    all: T.Controller[];
    selectedId?: string;
  };
}

// const defaultInputState: InputState = {};
const defaultInputState = testInitialState.input;

export interface ControllerBindingsUpdate {
  bindingsId: string;
  key: string;
  binding: Maybe<T.Binding>;
}

const updateController = (
  bindings: T.Controller,
  key: string,
  binding: Maybe<T.Binding>,
): T.Controller => ({
  ...bindings,
  bindings: {
    ...bindings.bindings,
    [key]: binding,
  },
});

export const inputReducer = (
  state: InputState = defaultInputState,
  action: T.EditorAction,
): InputState => {
  switch (action.type) {
    case 'selectEditorOption': {
      return {
        ...state,
        selectedGamepadIndex:
          action.data.kind === 'gamepad' ? action.data.index : undefined,
        controller: {
          ...state.controller,
          selectedId:
            action.data.kind === 'controller' ? action.data.id : undefined,
        },
      };
    }

    case 'listenNextInput': {
      return { ...state, remap: action.data };
    }

    case 'stopListening': {
      return { ...state, remap: undefined };
    }

    case 'updateControllerBindings': {
      const { bindingsId, key, binding } = action.data;

      let initialBindings = state.controller.all;

      // remove other duplicate bindings if a new binding is being set
      if (binding) {
        initialBindings = initialBindings.map(b => {
          const maybeKey = hasKeyBoundTo(b, binding);
          return {
            ...b,
            bindings: maybeKey ? withoutKey(b.bindings, maybeKey) : b.bindings,
          };
        });
      }

      return {
        ...state,
        controller: {
          ...state.controller,
          all: mapIf(
            initialBindings,
            bs => bs.id === bindingsId,
            bs => updateController(bs, key, binding),
          ),
        },
      };
    }

    case 'updateControllerName': {
      const { id, name } = action.data;

      return mapPath(
        ['controller', 'all'],
        cs =>
          mapIf(
            cs as T.Controller[],
            c => c.id === id,
            c => ({
              ...c,
              name: name.length === 0 ? 'Unnamed controller' : name,
            }),
          ),
        state,
      );
    }
  }

  return state;
};
