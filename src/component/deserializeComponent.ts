import { Component } from '.';
import { ButtonComponent } from './ButtonComponent';
import { DPadComponent } from './DPadComponent';
import { StickComponent } from './StickComponent';
import { ComponentData } from '../display/ComponentManager';
import { SerializedComponent } from '../types';

export const deserializeComponent =
  (s: SerializedComponent): ComponentData => {
    let component: Component<any>;

    switch (s.kind) {
      case 'button': component = new ButtonComponent(s.baseConfig, s.config); break;
      case 'stick': component = new StickComponent(s.baseConfig, s.config); break;
      case 'dpad': component = new DPadComponent(s.baseConfig, s.config); break;
    }

    return { bindingId: s.baseConfig.bindingId, component };
  };
