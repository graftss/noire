import * as React from 'react';
import Select from 'react-select';
import * as T from '../../types';

interface ComponentOption {
  value: string;
  label: string;
}

interface ComponentSelectProps {
  selectEditorOption: (o: T.EditorOption) => void;
  components: T.SerializedComponent[];
  selected: T.SerializedComponent;
}

const toOption = (c: T.SerializedComponent): ComponentOption | undefined =>
  !c
    ? undefined
    : {
        value: c.id,
        label: c.id,
      };

export const ComponentSelect: React.SFC<ComponentSelectProps> = ({
  selected,
  components,
  selectEditorOption,
}) => (
  <Select
    value={toOption(selected) || null}
    options={components.map(toOption)}
    onChange={(o: ComponentOption) =>
      selectEditorOption({ kind: 'component', id: o.value })
    }
    placeholder="Components"
  />
);
