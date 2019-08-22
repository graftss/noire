import * as T from '../../types';
import { mapComponentWithId } from '../maps';
import { assocPath } from '../../utils';
import {
  setComponentInputFilter,
  removeComponentInputFilter,
} from '../../display/component';

export interface DisplayState {
  components: T.SerializedComponent[];
  selectedComponentId?: string;
  transformerTarget?: T.KonvaSelectable;
  transformerVisibility?: boolean;
}

export const initialDisplayState: DisplayState = {
  components: [],
};

export const displayReducer = (
  state: DisplayState = initialDisplayState,
  action: T.EditorAction,
): DisplayState => {
  switch (action.type) {
    case 'addComponent': {
      return {
        ...state,
        components: [...state.components, action.data],
      };
    }

    case 'removeComponent': {
      return {
        ...state,
        components: state.components.filter(c => c.id !== action.data),
        selectedComponentId:
          state.selectedComponentId === action.data
            ? undefined
            : state.selectedComponentId,
      };
    }

    case 'selectComponent': {
      const id = action.data;
      if (id !== state.selectedComponentId) {
        return {
          ...state,
          selectedComponentId: id,
          transformerTarget: { kind: 'component', id },
          transformerVisibility: true,
        };
      } else {
        return state;
      }
    }

    case 'deselectComponent': {
      return {
        ...state,
        selectedComponentId: undefined,
        transformerTarget: undefined,
      };
    }

    case 'setComponentState': {
      const { data } = action;

      return mapComponentWithId.proj(state)(data.id, c => ({
        ...c,
        state: { ...c.state, ...data.state },
      }));
    }

    case 'setComponentInputFilter': {
      const { id, ref, filter } = action.data;

      return mapComponentWithId.proj(state)(id, component =>
        setComponentInputFilter(component, ref, filter),
      );
    }

    case 'removeComponentInputFilter': {
      const { id, ref } = action.data;

      return mapComponentWithId.proj(state)(id, component =>
        removeComponentInputFilter(component, ref),
      );
    }

    case 'setComponentModel': {
      const { id, modelName, model } = action.data;

      return mapComponentWithId.proj(state)(id, c =>
        assocPath(['graphics', 'models', modelName], model, c),
      );
    }

    case 'setComponentTexture': {
      const { id, textureName, texture } = action.data;

      return mapComponentWithId.proj(state)(id, c =>
        assocPath(['graphics', 'textures', textureName], texture, c),
      );
    }

    case 'toggleKonvaTransformer': {
      return { ...state, transformerVisibility: !state.transformerVisibility };
    }
  }

  return state;
};
