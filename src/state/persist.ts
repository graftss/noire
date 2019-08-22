import * as T from '../types';
import * as selectors from './selectors';
import { initialDisplayState } from './reducers/display';
import { initialInputState } from './reducers/input';

export interface PersistentState {
  components: T.SerializedComponent[];
  controllers: T.Controller[];
}

const projectToPersistentState = (state: T.EditorState): PersistentState => ({
  components: selectors.components(state),
  controllers: selectors.controllers(state),
});

export const serializeEditorState = (state: T.EditorState): string =>
  JSON.stringify(projectToPersistentState(state));

const recoverEditorState = ({
  components,
  controllers,
}: PersistentState): Partial<T.EditorState> => ({
  display: { ...initialDisplayState, components },
  input: { ...initialInputState, controllers },
});

export const deserializePersistentString = (
  str: string,
): Partial<T.EditorState> => recoverEditorState(JSON.parse(str));
