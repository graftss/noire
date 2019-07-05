import ButtonComponent, { ButtonComponentConfig } from './ButtonComponent';
import StickComponent, { StickComponentConfig } from './StickComponent';
import DPadComponent, { DPadComponentConfig } from './DPadComponent';
import { ComponentData } from '../display/ComponentManager';
import Component, { BaseComponentConfig } from '.';

export type SerializedComponent = {
  baseConfig: BaseComponentConfig;
} & (
  ({ kind: 'button'; config: ButtonComponentConfig; }) |
  ({ kind: 'stick'; config: StickComponentConfig; }) |
  ({ kind: 'dpad'; config: DPadComponentConfig; })
);

export default (s: SerializedComponent): ComponentData => {
  let component: Component<any>;

  switch (s.kind) {
    case 'button': component = new ButtonComponent(s.baseConfig, s.config); break;
    case 'stick': component = new StickComponent(s.baseConfig, s.config); break;
    case 'dpad': component = new DPadComponent(s.baseConfig, s.config); break;
  }

  return { bindingId: s.baseConfig.bindingId, component };
};
