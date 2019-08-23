import * as T from '../types';
import * as selectors from './selectors';
import { initialDisplayState } from './reducers/display';
import { initialInputState } from './reducers/input';

export interface PersistentState {
  activeDisplay: T.SerializedDisplay;
  controllers: T.Controller[];
  savedDisplays: T.SerializedDisplay[];
}

export const defaultPersistentState: PersistentState = {
  activeDisplay: initialDisplayState.active,
  controllers: [],
  savedDisplays: [],
};

const projectToPersistentState = (state: T.EditorState): PersistentState => ({
  activeDisplay: selectors.activeDisplay(state),
  savedDisplays: selectors.savedDisplays(state),
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
    savedDisplays: { displays: savedDisplays || [] },
  };
};

export const deserializePersistentString = (
  str: string,
): Partial<T.EditorState> => recoverEditorState(JSON.parse(str));
