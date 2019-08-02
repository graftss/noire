import * as React from 'react';
import Select from 'react-select';
import * as T from '../../../types';

interface ControllerSelectProps {
  controllers: T.Controller[];
  selected: Maybe<T.Controller>;
  selectController: (id: string) => void;
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
  controllers,
  selected,
  selectController,
}) => (
  <div>
    <Select
      value={selected ? toOption(selected) : null}
      options={controllers.map(toOption)}
      onChange={o => selectController(o.value)}
      placeholder="Controllers"
    />
  </div>
);
