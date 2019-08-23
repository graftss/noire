import * as T from '../types';
import { mapIf, mapPath } from '../utils';
import { lift } from './selectors';

export const mapActiveComponents = lift(
  'display',
  (state: T.DisplayState) => (
    f: Auto<T.SerializedComponent[]>,
  ): T.DisplayState => mapPath(['active', 'components'], f, state),
);

export const mapActiveComponentWithId = lift(
  'display',
  (state: T.DisplayState) => (
    id: string,
    f: Auto<T.SerializedComponent>,
  ): T.DisplayState =>
    mapPath(
      ['active', 'components'],
      (components: T.SerializedComponent[]) =>
        mapIf(c => c.id === id, f, components),
      state,
    ),
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

export const upsertDisplay = lift(
  'savedDisplays',
  (state: T.SavedDisplaysState) => (
    display: T.SerializedDisplay,
  ): T.SavedDisplaysState => {
    const { displays } = state;
    let found = false;
    const newDisplays = displays.map(d => {
      if (d.id === display.id) {
        found = true;
        return display;
      }
      return d;
    });

    return {
      ...state,
      displays: found ? newDisplays : [...newDisplays, display],
    };
  },
);
