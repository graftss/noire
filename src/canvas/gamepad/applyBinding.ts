import * as T from '../types';

export const axisMap: T.InputMap<
  T.AxisBinding,
  T.AxisInput
> = binding => gamepad => {
  const { index, inverted, deadzone = 0 } = binding;

  const raw = gamepad.axes[index] * (inverted ? -1 : 1);
  return Math.abs(raw) < deadzone ? 0 : raw;
};

export const axisValueMap: T.InputMap<
  T.AxisValueBinding,
  T.ButtonInput
> = binding => gamepad => {
  const { axis, value, marginOfError = 0.001 } = binding;

  return {
    pressed: Math.abs(gamepad.axes[axis] - value) < marginOfError,
  };
};

export const buttonMap: T.InputMap<
  T.ButtonBinding,
  T.ButtonInput
> = binding => gamepad => {
  return { pressed: gamepad.buttons[binding.index].pressed };
};

export const buttonInputMap: T.InputMap<
  T.ButtonInputBinding,
  T.ButtonInput
> = binding => gamepad =>
  binding.kind === 'button'
    ? buttonMap(binding.binding)(gamepad)
    : axisValueMap(binding.binding)(gamepad);

export const dPadMap: T.InputMap<T.DPadBinding, T.DPadInput> = ({
  u,
  l,
  d,
  r,
}) => gamepad => ({
  u: buttonInputMap(u)(gamepad),
  l: buttonInputMap(l)(gamepad),
  d: buttonInputMap(d)(gamepad),
  r: buttonInputMap(r)(gamepad),
});

export const stickMap: T.InputMap<T.StickBinding, T.StickInput> = binding => {
  const inputMaps = {
    h: axisMap(binding.h),
    v: axisMap(binding.v),
    down: buttonMap(binding.down),
  };

  return gamepad => ({
    x: inputMaps.h(gamepad),
    y: inputMaps.v(gamepad),
    down: inputMaps.down(gamepad),
  });
};

export const applyBinding = (
  b: T.Binding,
  gamepad: Gamepad,
): T.Input | undefined => {
  switch (b.kind) {
    case 'axis':
      return {
        kind: 'axis',
        input: axisMap(b.binding)(gamepad),
      };

    case 'button':
      return {
        kind: 'button',
        input: buttonInputMap(b.binding)(gamepad),
      };

    case 'dpad':
      return {
        kind: 'dpad',
        input: dPadMap(b.binding)(gamepad),
      };

    case 'stick':
      return {
        kind: 'stick',
        input: stickMap(b.binding)(gamepad),
      };
  }
};
