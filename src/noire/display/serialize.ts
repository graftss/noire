import * as T from '../types';
import { every, uuid, validateJSONString } from '../utils';
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
  backgroundColor: string;
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
  backgroundColor: 'rgba(0,0,0,0)',
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
export const validateDisplay = (o: any): boolean =>
  o !== undefined &&
  typeof o.id === 'string' &&
  typeof o.name === 'string' &&
  Array.isArray(o.components) &&
  every(validateSerializedComponent, o.components);

export const displayToString = (display: SerializedDisplay): string =>
  JSON.stringify({ ...display, v: '1' });

export const stringToDisplay: (
  str: string,
) => Maybe<SerializedDisplay> = validateJSONString(validateDisplay);

export type DisplayFieldKey = 'name' | 'canvasSize' | 'backgroundColor';

export interface DisplayField<FK extends T.EditorFieldKind = T.EditorFieldKind>
  extends T.EditorField<FK> {
  key: DisplayFieldKey;
  getter: (display: SerializedDisplay) => T.EditorFieldType<FK>;
  setter: (
    display: SerializedDisplay,
    value: T.EditorFieldType<FK>,
  ) => SerializedDisplay;
}

const displayFields: DisplayField[] = [
  {
    label: 'Display name',
    key: 'name',
    kind: 'string',
    defaultValue: 'Untitled display',
    props: undefined,
    getter: display => display.name,
    setter: (display, name) => ({ ...display, name }),
  } as DisplayField<'string'>,
  {
    label: 'Canvas size',
    key: 'canvasSize',
    kind: 'Vec2',
    defaultValue: { x: 500, y: 700 },
    props: { precision: 1 },
    getter: display => ({ x: display.width, y: display.height }),
    setter: (display, { x, y }) => ({ ...display, width: x, height: y }),
  } as DisplayField<'Vec2'>,
  {
    label: 'Background color',
    key: 'backgroundColor',
    kind: 'string',
    defaultValue: 'rgba(0,0,0,0)',
    props: undefined,
    getter: display => display.backgroundColor,
    setter: (display, backgroundColor) => ({ ...display, backgroundColor }),
  } as DisplayField<'string'>,
];

export const getDisplayFields = (): DisplayField[] => [...displayFields];
