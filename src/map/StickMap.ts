import AxisMap, { AxisBinding, AxisConfig, AxisInput } from './AxisMap';
import ButtonMap, { ButtonBinding, ButtonInput } from './ButtonMap';

export interface StickConfig {
  h?: AxisConfig;
  v?: AxisConfig;
}

export interface StickBinding {
  h: AxisBinding;
  v: AxisBinding;
  down?: ButtonBinding;
}

export interface StickInput {
  x: AxisInput;
  y: AxisInput;
  down: ButtonInput;
}

export default class StickMap {
  binding: StickBinding;
  config: StickConfig;
  hMap: AxisMap;
  vMap: AxisMap;
  downMap?: ButtonMap;

  constructor(binding: StickBinding, config: StickConfig = {}) {
    this.binding = binding;
    this.config = config;

    this.hMap = new AxisMap(binding.h, config.h);
    this.vMap = new AxisMap(binding.v, config.v);
    if (binding.down) {
      this.downMap = new ButtonMap(binding.down);
    }

  }

  getInput(gamepad: Gamepad): StickInput {
    const { down } = this.binding;

    return {
      x: this.hMap.getInput(gamepad),
      y: this.vMap.getInput(gamepad),
      down: this.downMap.getInput(gamepad),
    };
  }
}
