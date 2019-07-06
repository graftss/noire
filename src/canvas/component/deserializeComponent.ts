import * as T from '../types';
import { Component } from '.';
import { ButtonComponent } from './ButtonComponent';
import { DPadComponent } from './DPadComponent';
import { StickComponent } from './StickComponent';

export const deserializeComponent = (
  s: T.SerializedComponent,
): Component => {
  let component: Component;

  switch (s.kind) {
    case 'button':
      return new ButtonComponent(s.baseConfig, s.config);
    case 'stick':
      return new StickComponent(s.baseConfig, s.config);
    case 'dpad':
      return new DPadComponent(s.baseConfig, s.config);
  }

  return component;
};
