import ButtonComponent, { ButtonComponentConfig } from './ButtonComponent';
import StickComponent, { StickComponentConfig } from './StickComponent';
import DPadComponent, { DPadComponentConfig } from './DPadComponent';
import Component, { BaseComponentConfig } from '.';

export type SerializedComponent = {
  baseConfig: BaseComponentConfig;
} & (
  ({ kind: 'button'; config: ButtonComponentConfig; }) |
  ({ kind: 'stick'; config: StickComponentConfig; }) |
  ({ kind: 'dpad'; config: DPadComponentConfig; })
);

export default (s: SerializedComponent): Component<any> => {
  switch (s.kind) {
    case 'button': return new ButtonComponent(s.baseConfig, s.config);
    case 'stick': return new StickComponent(s.baseConfig, s.config);
    case 'dpad': return new DPadComponent(s.baseConfig, s.config);
  }
};
