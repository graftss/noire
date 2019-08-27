import * as T from '../types';
import { every, uuid } from '../utils';
import {
  validateSerializedComponent,
  portOutdatedComponent,
} from './component';

export interface SerializedDisplay {
  id: string;
  name: string;
  width: number;
  height: number;
  components: T.SerializedComponent[];
}

export const cloneDisplay = (
  display: SerializedDisplay,
  useClonedName = true,
): SerializedDisplay => ({
  ...display,
  name: useClonedName ? `Clone of ${display.name}` : display.name,
  id: uuid(),
});

export const newDisplay = (): SerializedDisplay => ({
  id: uuid(),
  name: 'Untitled display',
  width: 500,
  height: 700,
  components: [],
});

export const setDisplayName = (
  display: T.SerializedDisplay,
  name: string,
): T.SerializedDisplay => ({
  ...display,
  name,
});

export const portOutdatedDisplay = (
  display: T.SerializedDisplay,
): T.SerializedDisplay => {
  display.components = display.components.map(portOutdatedComponent);
  return display;
};

// decides if an arbitrary object can be cast as a `SerializedDisplay`
export const validateDisplay = (o: any): Maybe<SerializedDisplay> => {
  const valid =
    o !== undefined &&
    typeof o.id === 'string' &&
    typeof o.name === 'string' &&
    Array.isArray(o.components) &&
    every(validateSerializedComponent, o.components);

  return valid ? portOutdatedDisplay(o) : undefined;
};

export const displayToString = (display: SerializedDisplay): string =>
  JSON.stringify({ ...display, v: '1' });

export const stringToDisplay = (str: string): Maybe<SerializedDisplay> => {
  try {
    const display = validateDisplay(JSON.parse(str));
    if (display) return display;
  } catch (e) {}
  return;
};
