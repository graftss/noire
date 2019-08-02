import * as T from '../types';
import { mapIf } from '../utils';
import { lift } from './selectors';

export const mapComponentWithId = lift(
  'display',
  (state: T.DisplayState) => (
    id: string,
    f: Auto<T.SerializedComponent>,
  ): T.DisplayState => ({
    ...state,
    components: mapIf(c => c.id === id, f, state.components),
  }),
);

export const mapControllerWithId = lift(
  'input',
  (state: T.InputState) => (
    id: string,
    f: Auto<T.Controller>,
  ): T.InputState => ({
    ...state,
    controllers: mapIf(c => c.id === id, f, state.controllers),
  }),
);
