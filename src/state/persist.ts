import * as T from '../types';
import * as selectors from './selectors';
import { initialDisplayState } from './reducers/display';
import { initialInputState } from './reducers/input';
import { initialSavedDisplaysState } from './reducers/savedDisplays';

export interface PersistentState {
  activeDisplay: T.SerializedDisplay;
  controllers: T.Controller[];
  savedDisplays: T.SavedDisplaysState;
}

export const defaultPersistentState: PersistentState = {
  activeDisplay: initialDisplayState.active,
  controllers: [],
  savedDisplays: initialSavedDisplaysState,
};

const projectToPersistentState = (state: T.EditorState): PersistentState => ({
  activeDisplay: selectors.activeDisplay(state),
  savedDisplays: selectors.savedDisplaysState(state),
  controllers: selectors.controllers(state),
});

export const serializeEditorState = (state: T.EditorState): string =>
  JSON.stringify(projectToPersistentState(state));

const recoverEditorState = (
  pState: PersistentState,
): Partial<T.EditorState> => {
  const { activeDisplay, controllers, savedDisplays } = {
    ...defaultPersistentState,
    ...pState,
  };

  return {
    display: activeDisplay && { ...initialDisplayState, active: activeDisplay },
    input: { ...initialInputState, controllers },
    savedDisplays,
  };
};

export const deserializePersistentString = (
  str: string,
): Partial<T.EditorState> => recoverEditorState(JSON.parse(str));
