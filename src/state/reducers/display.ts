import * as T from '../../types';
import { mapActiveComponents, mapActiveComponentWithId } from '../maps';
import { assocPath, uuid } from '../../utils';
import {
  setComponentInputFilter,
  removeComponentInputFilter,
} from '../../display/component';

export interface DisplayState {
  active: T.SerializedDisplay;
  selectedComponentId?: string;
  transformerTarget?: T.KonvaSelectable;
  transformerVisibility?: boolean;
}

export const initialDisplayState: DisplayState = {
  active: {
    id: uuid(),
    components: [],
    name: 'Untitled display',
  },
};

export const displayReducer = (
  state: DisplayState = initialDisplayState,
  action: T.EditorAction,
): DisplayState => {
  switch (action.type) {
    case 'addComponent': {
      return {
        ...mapActiveComponents.proj(state)(components => [
          ...components,
          action.data,
        ]),
        selectedComponentId: action.data.id,
      };
    }

    case 'removeComponent': {
      const remove: Auto<T.SerializedComponent[]> = cs =>
        cs.filter(c => c.id !== action.data);

      const selectedComponentId =
        state.selectedComponentId === action.data
          ? undefined
          : state.selectedComponentId;

      return {
        ...mapActiveComponents.proj(state)(remove),
        selectedComponentId,
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

      return mapActiveComponentWithId.proj(state)(data.id, c => ({
        ...c,
        state: { ...c.state, ...data.state },
      }));
    }

    case 'setComponentInputFilter': {
      const { id, ref, filter } = action.data;

      return mapActiveComponentWithId.proj(state)(id, component =>
        setComponentInputFilter(component, ref, filter),
      );
    }

    case 'removeComponentInputFilter': {
      const { id, ref } = action.data;

      return mapActiveComponentWithId.proj(state)(id, component =>
        removeComponentInputFilter(component, ref),
      );
    }

    case 'setComponentModel': {
      const { id, modelName, model } = action.data;

      return mapActiveComponentWithId.proj(state)(id, c =>
        assocPath(['graphics', 'models', modelName], model, c),
      );
    }

    case 'setComponentTexture': {
      const { id, textureName, texture } = action.data;

      return mapActiveComponentWithId.proj(state)(id, c =>
        assocPath(['graphics', 'textures', textureName], texture, c),
      );
    }

    case 'toggleKonvaTransformer': {
      return { ...state, transformerVisibility: !state.transformerVisibility };
    }
  }

  return state;
};
