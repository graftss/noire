import * as React from 'react';
import Select from 'react-select';
import * as T from '../../types';

interface ControllerSelectProps {
  controllers: T.Controller[];
  selectedController?: T.Controller;
  selectEditorOption: (o: T.EditorOption) => void;
}

interface ControllerOption {
  value: string;
  label: string;
}

const toOption = (c: T.Controller): ControllerOption => ({
  value: c.id,
  label: c.name,
});

export const ControllerSelect: React.SFC<ControllerSelectProps> = ({
  controllers,
  selectedController,
  selectEditorOption,
}) => (
  <Select
    value={selectedController ? toOption(selectedController) : null}
    options={controllers.map(toOption)}
    onChange={(o: ControllerOption) =>
      selectEditorOption({ kind: 'controller', id: o.value })
    }
    placeholder="Controllers"
  />
);
