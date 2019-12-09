import * as React from 'react';
import Select from 'react-select';

interface BaseOption {
  value: string;
  label: string;
}

interface EditorSelectProps<T, O extends BaseOption> {
  data: T[];
  onChange?: Maybe<(o: O) => void>;
  placeholder: string;
  selected: Maybe<T>;
  toOption: (t: T, index?: number) => O;
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
      menuPlacement="top"
      onChange={onChange}
      options={data.map(toOption)}
      value={selected ? toOption(selected) : null}
      placeholder={placeholder}
    />
  );
}
