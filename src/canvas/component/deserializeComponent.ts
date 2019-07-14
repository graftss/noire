import * as T from '../../types';
import { ButtonComponent } from './ButtonComponent';
import { StickComponent } from './StickComponent';
import { Component } from './Component';
import { DPadComponent } from './DPadComponent';

export const deserializeComponent = (s: T.SerializedComponent): Component => {
  switch (s.kind) {
    case 'button':
      return new ButtonComponent(s.id, s.state);
    case 'stick':
      return new StickComponent(s.id, s.state);
    case 'dpad':
      return new DPadComponent(s.id, s.state);
  }
};
