import * as React from 'react';
import Select from 'react-select';
import * as T from '../../../types';

interface ControllerSelectProps {
  all: T.Controller[];
  selected: Maybe<T.Controller>;
  selectController: (o: ControllerOption) => void;
}

interface ControllerOption {
  value: string;
  label: string;
}

const toOption = (b: T.Controller): ControllerOption => ({
  value: b.id,
  label: b.name,
});

export const ControllerSelect: React.SFC<ControllerSelectProps> = ({
  all,
  selected,
  selectController,
}) => (
  <div>
    <Select
      value={selected ? toOption(selected) : null}
      options={all.map(toOption)}
      onChange={selectController}
      placeholder="Controllers"
    />
  </div>
);
