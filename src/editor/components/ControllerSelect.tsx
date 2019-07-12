import * as React from 'react';
import Select from 'react-select';

import * as T from '../../types';

interface ControllerSelectProps {
  controllers: T.Controller[];
  selectedController: T.Controller | undefined;
  selectController: (id: string) => void;
}

interface ControllerOption {
  value: string;
  label: string;
}

const toOption = (c: T.Controller): ControllerOption | undefined =>
  c && {
    value: c.id,
    label: c.name,
  };

export const ControllerSelect: React.SFC<ControllerSelectProps> = ({
  controllers,
  selectedController,
  selectController,
}) => (
  <Select
    value={toOption(selectedController) || null}
    options={controllers.map(toOption)}
    onChange={o => selectController(o.value)}
    placeholder="Controllers"
  />
);
