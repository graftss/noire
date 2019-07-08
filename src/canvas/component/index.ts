export * from './ButtonComponent';
export * from './Component';
export * from './deserializeComponent';
export * from './DPadComponent';
export * from './StickComponent';

import { ButtonComponentConfig } from './ButtonComponent';
import { DPadComponentConfig } from './DPadComponent';
import { StickComponentConfig } from './StickComponent';

export type SerializedComponent =
  | ButtonComponentConfig
  | StickComponentConfig
  | DPadComponentConfig;
