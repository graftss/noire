import * as React from 'react';

interface Props<T> {
  defaultValue: T;
  render: (value: T, setValue: (v: T) => void) => React.ReactNode;
  update: (o: T) => void;
}

interface State<T> {
  value: T;
}

export class WithDefault<T> extends React.Component<Props<T>, State<T>> {
  constructor(props: Props<T>) {
    super(props);
    this.state = { value: props.defaultValue };
  }

  componentWillReceiveProps(nextProps: Props<T>): void {
    if (nextProps.defaultValue !== this.state.value) {
      this.setValue(nextProps.defaultValue);
    }
  }

  setValue = (value: T) => this.setState({ value });

  render(): React.ReactNode {
    return this.props.render(this.state.value, this.setValue);
  }
}