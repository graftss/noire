import {
  stickMap,
  dPadMap,
  InputMap,
  StickBinding,
  DPadBinding,
  StickInput,
  DPadInput,
} from '../gamepad/inputMaps';

export interface GamepadBinding {
  ls: StickBinding;
  rs: StickBinding;
  dpad: DPadBinding;
}

export interface GamepadInput {
  ls: StickInput;
  rs: StickInput;
  dpad: DPadInput;
}

export default (binding: GamepadBinding) => {
  const inputMaps = {
    ls: stickMap(binding.ls),
    rs: stickMap(binding.rs),
    dpad: dPadMap(binding.dpad),
  };

  return gamepad => ({
    ls: inputMaps.ls(gamepad),
    rs: inputMaps.rs(gamepad),
    dpad: inputMaps.dpad(gamepad),
  });
};
