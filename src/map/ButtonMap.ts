export interface ButtonBinding {
  index: number;
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
    const { index } = this.binding;

    return {
      pressed: gamepad.buttons[index].pressed,
    };
  }
}
