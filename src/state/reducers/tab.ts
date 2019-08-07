import * as T from '../../types';

export type TabKind = 'components' | 'controllers' | 'presentation';

export const tabOrder: TabKind[] = [
  'components',
  'controllers',
  'presentation',
];

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

    case 'selectComponent': {
      return { ...state, kind: 'components' };
    }

    case 'selectController': {
      return { ...state, kind: 'controllers' };
    }
  }

  return state;
};
