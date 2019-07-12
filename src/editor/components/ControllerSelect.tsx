import * as React from 'react';
import Select from 'react-select';

import * as T from '../../types';
import { find } from '../../utils';

interface ControllerSelectProps {
  controllers: T.Controller[];
  selectedControllerId?: string;
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
  selectedControllerId,
  selectController,
}) => (
  <Select
    value={
      toOption(find(c => c.id === selectedControllerId, controllers)) || null
    }
    options={controllers.map(toOption)}
    onChange={o => selectController(o.value)}
    placeholder="Controllers"
  />
);
