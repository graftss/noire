import * as T from '../../types';

export type TabKind = 'components' | 'controllers';

export const tabOrder: TabKind[] = ['components', 'controllers'];

export interface TabState {
  kind: TabKind;
}

const initialTabState: TabState = {
  kind: 'components',
};

export const tabReducer = (
  state: TabState = initialTabState,
  action: T.EditorAction,
): TabState => {
  switch (action.type) {
    case 'setTab': {
      return { ...state, kind: action.data };
    }

    case 'selectEditorOption': {
      switch (action.data.kind) {
        case 'component':
          return { ...state, kind: 'components' };
        case 'controller':
          return { ...state, kind: 'controllers' };
      }
    }
  }

  return state;
};
