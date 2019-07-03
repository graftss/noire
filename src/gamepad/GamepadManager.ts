export default class GamepadManager {
  activeIndex: number = -1;
  selector: HTMLSelectElement;
  gamepads: Gamepad[];
  activeGamepad: Gamepad;

  constructor(selectorId: string) {
    this.rerender = this.rerender.bind(this);
    window.addEventListener("gamepadconnected", this.rerender);
    window.addEventListener("gamepaddisconnected", this.rerender);

    this.selector = <HTMLSelectElement>document.getElementById(selectorId);
    this.updateActive = this.updateActive.bind(this);
    this.selector.addEventListener('change', this.updateActive);
  }

  getActiveGamepad(): Gamepad {
    const gamepads = navigator.getGamepads();
    return gamepads[this.activeIndex];
  }

  updateActive() {
    this.activeIndex = this.selector.selectedIndex;
  }

  rerender() {
    this.gamepads = navigator.getGamepads();
    this.activeIndex = -1;
    this.activeGamepad = undefined;

    this.renderSelector();

    //TODO: for testing
    this.selector.selectedIndex = 1;
    this.activeIndex = 1;
  }

  renderSelector() {
    const { selector, gamepads } = this;
    const { options } = selector;

    options.length = 0;

    for (let i = 0; i < gamepads.length; i++) {
      const gamepad = gamepads[i];

      if (gamepad) {
        options[options.length] = new Option(
          `Player ${i + 1}: ${gamepad.id}`,
          i.toString()
        );
      }
    }
  }
}
