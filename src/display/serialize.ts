import * as T from '../types';
import { uuid } from '../utils';

export interface SerializedDisplay {
  id: string;
  name: string;
  components: T.SerializedComponent[];
}

export const cloneDisplay = (
  display: SerializedDisplay,
): SerializedDisplay => ({
  ...display,
  name: `Clone of ${display.name}`,
  id: uuid(),
});

export const newDisplay = (): SerializedDisplay => ({
  id: uuid(),
  name: 'Untitled display',
  components: [],
});

export const setDisplayName = (
  display: T.SerializedDisplay,
  name: string,
): T.SerializedDisplay => ({
  ...display,
  name,
});

export const displayToString = (display: T.SerializedDisplay): string =>
  JSON.stringify(display);
