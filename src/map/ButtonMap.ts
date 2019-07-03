export interface ButtonBindings {
  downIndex: number;
}

export interface ButtonInput {
  pressed: boolean;
}

export default class ButtonMap {
  bindings: ButtonBindings;

  constructor(bindings: ButtonBindings) {
    this.bindings = bindings;
  }

  getInput(gamepad: Gamepad): ButtonInput {
    const { downIndex } = this.bindings;

    return {
      pressed: gamepad.buttons[downIndex].pressed,
    };
  }
}
