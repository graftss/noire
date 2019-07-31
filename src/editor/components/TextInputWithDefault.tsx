import * as React from 'react';

interface Props {
  defaultValue: string;
  save: (o: string) => void;
}

interface State {
  value: string;
}

export class TextInputWithDefault extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { value: props.defaultValue };
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.defaultValue !== this.props.defaultValue) {
      this.setState({ value: nextProps.defaultValue });
    }
  }

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ value: e.target.value });
  };

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;

    if (e.keyCode === 13) {
      this.props.save(target.value);
      target.blur();
    }
  };

  render(): React.ReactNode {
    return (
      <input
        value={this.state.value}
        onChange={this.onInputChange}
        onBlur={e => this.props.save(e.target.value)}
        onKeyDown={this.onKeyDown}
        type="text"
      />
    );
  }
}
