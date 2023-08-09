import * as T from '../../types';

// export const tabOrder = ['display', 'controllers', 'config', 'about'] as const;
export const tabOrder = ['display', 'controllers', 'config'] as const;

export type TabKind = typeof tabOrder[number];

export interface TabState {
  kind: TabKind;
}

export const initialTabState: TabState = {
  kind: 'display',
};

export const tabReducer = (
  state: TabState = initialTabState,
  action: T.EditorAction,
): TabState => {
  switch (action.type) {
    case 'setTab': {
      return { ...state, kind: action.data };
    }

    case 'selectComponent': {
      return { ...state, kind: 'display' };
    }

    case 'selectController': {
      return { ...state, kind: 'controllers' };
    }
  }

  return state;
};
