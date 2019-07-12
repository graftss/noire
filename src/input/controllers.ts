import { map } from 'ramda';

import * as T from '../types';
import { applyBinding } from './bindings';

export interface PS2Map {
  padU: T.ButtonInputBinding;
  padL: T.ButtonInputBinding;
  padR: T.ButtonInputBinding;
  padD: T.ButtonInputBinding;
  select: T.ButtonInputBinding;
  start: T.ButtonInputBinding;
  square: T.ButtonInputBinding;
  triangle: T.ButtonInputBinding;
  circle: T.ButtonInputBinding;
  x: T.ButtonInputBinding;
  l1: T.ButtonInputBinding;
  l2: T.ButtonInputBinding;
  l3: T.ButtonInputBinding;
  r1: T.ButtonInputBinding;
  r2: T.ButtonInputBinding;
  r3: T.ButtonInputBinding;
  lsX: T.AxisBinding;
  lsY: T.AxisBinding;
  rsX: T.AxisBinding;
  rsY: T.AxisBinding;
}

const PS2KeyNames: Record<keyof PS2Map, string> = {
  padU: 'D-Pad Up',
  padL: 'D-Pad Left',
  padD: 'D-Pad Down',
  padR: 'D-Pad Right',
  select: 'Select',
  start: 'Start',
  square: 'Square',
  triangle: 'Triangle',
  circle: 'Circle',
  x: 'X',
  l1: 'L1',
  l2: 'L2',
  l3: 'L3',
  r1: 'R1',
  r2: 'R2',
  r3: 'R3',
  lsX: 'Left Stick X',
  lsY: 'Left Stick Y',
  rsX: 'Right Stick X',
  rsY: 'Right Stick Y',
};

export interface PS2GamepadMap {
  kind: 'ps2';
  map: PS2Map;
}

export type GamepadMap = {
  map: Record<string, T.Binding>;
} & PS2GamepadMap;

export type Controller = {
  id: string;
  name: string;
} & GamepadMap;

export interface ControllerKey {
  controllerId: string;
  key: string;
}

export const applyGamepadBindings = (
  g: Gamepad,
  c: GamepadMap,
): Record<string, T.Input> => map((b: T.Binding) => applyBinding(b, g), c.map);

export const stringifyControllerKey = <T extends Controller>(
  c: T,
  key: keyof T['map'],
): string => {
  switch (c.kind) {
    case 'ps2': {
      const _key = key as keyof PS2Map;
      return PS2KeyNames[_key];
    }
  }

  return 'unrecognized key';
};
