import * as T from '../../types';
import { mapIf, withoutKey } from '../../utils';
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
  controllerBindings: {
    all: T.ControllerBindings[];
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

const updateControllerBindings = (
  bindings: T.ControllerBindings,
  key: string,
  binding: Maybe<T.Binding>,
): T.ControllerBindings => ({
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
        controllerBindings: {
          ...state.controllerBindings,
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

      let initialBindings = state.controllerBindings.all;

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
        controllerBindings: {
          ...state.controllerBindings,
          all: mapIf(
            initialBindings,
            bs => bs.id === bindingsId,
            bs => updateControllerBindings(bs, key, binding),
          ),
        },
      };
    }
  }

  return state;
};
