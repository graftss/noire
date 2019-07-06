import * as T from '../../types';
import { ButtonComponent } from './ButtonComponent';
import { DPadComponent } from './DPadComponent';
import { StickComponent } from './StickComponent';

export const deserializeComponent = (s: T.SerializedComponent): T.Component => {
  let component: T.Component;

  switch (s.kind) {
    case 'button':
      return new ButtonComponent(s);
    case 'stick':
      return new StickComponent(s);
    case 'dpad':
      return new DPadComponent(s);
  }

  return component;
};
