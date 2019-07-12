import * as React from 'react';
import Select from 'react-select';
import * as T from '../../types';

interface GamepadSelectProps {
  selectedIndex?: number;
  selectEditorOption: (o: T.EditorOption) => void;
}

interface GamepadOption {
  value: number;
  label: string;
}

interface GamepadSelectState {
  options: GamepadOption[];
}

const toOption = (g: Gamepad): GamepadOption =>
  g && {
    value: g.index,
    label: `Player ${g.index + 1}: ${g.id}`,
  };

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
    const options: GamepadOption[] = [];

    for (let i = 0; i < gamepads.length; i++) {
      const g = gamepads[i];
      if (g !== null) options.push(toOption(g));
    }

    this.setState({ options });
  };

  render(): JSX.Element {
    const { options } = this.state;
    const { selectedIndex, selectEditorOption } = this.props;

    return (
      <Select
        value={selectedIndex ? options[selectedIndex] : null}
        options={options}
        placeholder="Gamepads"
        onChange={(i: GamepadOption) =>
          selectEditorOption({ kind: 'gamepad', index: i.value })
        }
      />
    );
  }
}
