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

export interface PS2Controller {
  kind: 'ps2';
  map: PS2Map;
}

export type ControllerMap = PS2Map;

export type Controller = {
  id: string;
  map: Record<string, T.Binding>;
} & PS2Controller;

export interface ControllerKey {
  controllerId: string;
  key: string;
}

export const applyControllerBindings = (
  g: Gamepad,
  c: Controller,
): Record<string, T.Input> => map((b: T.Binding) => applyBinding(b, g), c.map);
