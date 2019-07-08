import * as React from 'react';
import Select from 'react-select';

interface GamepadSelectProps {
  selectedIndex?: number;
  selectGamepad: (index: number) => void;
}

interface GamepadOption {
  value: number;
  label: string;
}

interface GamepadSelectState {
  options: GamepadOption[];
}

const toOption = (g: Gamepad): GamepadOption => ({
  value: g.index,
  label: `Player ${g.index + 1}: ${g.id}`,
});

export class GamepadSelect extends React.Component<
  GamepadSelectProps,
  GamepadSelectState
> {
  constructor(props) {
    super(props);
    this.state = { options: [] };
  }

  componentDidMount(): void {
    window.addEventListener('gamepadconnected', this.updateGamepads);
    window.addEventListener('gamepaddisconnected', this.updateGamepads);
  }

  updateGamepads = (): void => {
    const gamepads = navigator.getGamepads();
    const options = [];

    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) options.push(toOption(gamepads[i]));
    }

    this.setState({ options });
  };

  render(): JSX.Element {
    const { options } = this.state;
    const { selectedIndex, selectGamepad } = this.props;

    return (
      <Select
        value={options[selectedIndex] || null}
        options={options}
        placeholder="Gamepads"
        onChange={(i: GamepadOption) => selectGamepad(i.value)}
      />
    );
  }
}
