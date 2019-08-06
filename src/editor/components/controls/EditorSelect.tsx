import * as React from 'react';
import Select from 'react-select';

interface BaseOption {
  value: string;
  label: string;
}

interface EditorSelectProps<T, O extends BaseOption> {
  data: T[];
  onChange: (o: O) => void;
  placeholder: string;
  selected: T;
  toOption: (t: T) => O;
}

export function EditorSelect<T, O extends BaseOption>({
  data,
  onChange,
  placeholder,
  selected,
  toOption,
}: EditorSelectProps<T, O>): JSX.Element {
  return (
    <Select
      options={data.map(toOption)}
      value={selected ? toOption(selected) : null}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
