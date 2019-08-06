import * as T from '../../types';
import { testInitialState } from '../testInitialState';
import { mapComponentWithId } from '../maps';
import { mapPath } from '../../utils';

export interface DisplayState {
  components: T.SerializedComponent[];
  selectedComponentId?: string;
  transformerTarget?: T.KonvaSelectable;
  transformerVisibility?: boolean;
}

export const displayReducer = (
  state: DisplayState = testInitialState.display,
  action: T.EditorAction,
): DisplayState => {
  switch (action.type) {
    case 'selectComponent': {
      const id = action.data;
      if (id === undefined) {
        return {
          ...state,
          selectedComponentId: undefined,
          transformerTarget: undefined,
        };
      } else if (id !== state.selectedComponentId) {
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

    case 'updateComponentState': {
      const { data } = action;

      return mapComponentWithId.proj(state)(
        data.id,
        c =>
          ({
            ...c,
            state: { ...c.state, ...data.state },
          } as typeof c),
      );
    }

    case 'updateComponentFilters': {
      const { id, filters } = action.data;

      return mapComponentWithId.proj(state)(id, c => ({ ...c, filters }));
    }

    case 'updateComponentModel': {
      const { id, modelName, model } = action.data;

      return mapComponentWithId.proj(state)(id, c =>
        mapPath(['graphics', 'models', modelName], () => model, c),
      );
    }

    case 'toggleKonvaTransformer': {
      return { ...state, transformerVisibility: !state.transformerVisibility };
    }
  }

  return state;
};
