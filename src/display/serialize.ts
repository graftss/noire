import * as T from '../types';
import { every, uuid } from '../utils';
import { validateSerializedComponent } from './component';

export interface SerializedDisplay {
  id: string;
  name: string;
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

const validateDisplay = (o: any): boolean =>
  o !== undefined &&
  typeof o.id === 'string' &&
  typeof o.name === 'string' &&
  Array.isArray(o.components) &&
  every(validateSerializedComponent, o.components);

export const stringToDisplay = (str: string): Maybe<T.SerializedDisplay> => {
  try {
    const display = JSON.parse(str);
    if (validateDisplay(display)) return display;
  } catch (e) {}

  return;
};
