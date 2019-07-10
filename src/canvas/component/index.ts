import { ButtonComponentConfig } from './ButtonComponent';
import { DPadComponentConfig } from './DPadComponent';
import { StickComponentConfig } from './StickComponent';

export type SerializedComponent =
  | ButtonComponentConfig
  | StickComponentConfig
  | DPadComponentConfig;
