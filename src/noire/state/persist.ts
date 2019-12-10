import * as T from '../types';
import { portOutdatedDisplay } from '../display/serialize';
import * as selectors from './selectors';
import { initialInputState } from './reducers/input';
import { initialLocalState } from './reducers/local';
import { initialSavedDisplaysState } from './reducers/savedDisplays';

export interface PersistentState {
  controllers: T.Controller[];
  savedDisplays: T.SavedDisplaysState;
  local: T.LocalState;
}

export const defaultPersistentState: PersistentState = {
  controllers: [],
  savedDisplays: initialSavedDisplaysState,
  local: initialLocalState,
};

const projectToPersistentState = (state: T.EditorState): PersistentState => ({
  savedDisplays: selectors.savedDisplaysState(state),
  controllers: selectors.controllers(state),
  local: selectors.localState(state),
});

export const serializeEditorState = (state: T.EditorState): string =>
  JSON.stringify(projectToPersistentState(state));

const recoverEditorState = (
  pState: PersistentState,
): Partial<T.EditorState> => {
  const { controllers, local, savedDisplays: rawSavedDisplays } = {
    ...defaultPersistentState,
    ...pState,
  };

  const savedDisplays: T.SavedDisplaysState = {
    ...rawSavedDisplays,
    displays: rawSavedDisplays.displays.map(portOutdatedDisplay),
  };

  const active = selectors.selectedDisplay.proj(savedDisplays);

  return {
    display: active && { active },
    input: { ...initialInputState, controllers },
    local,
    savedDisplays,
  };
};

export const deserializePersistentString = (
  str: string,
): Partial<T.EditorState> => recoverEditorState(JSON.parse(str));
