export interface ButtonBinding {
  downIndex: number;
}

export interface ButtonInput {
  pressed: boolean;
}

export default class ButtonMap {
  binding: ButtonBinding;

  constructor(binding: ButtonBinding) {
    this.binding = binding;
  }

  getInput(gamepad: Gamepad): ButtonInput {
    const { downIndex } = this.binding;

    return {
      pressed: gamepad.buttons[downIndex].pressed,
    };
  }
}
