import * as React from 'react';
import Select from 'react-select';
import * as T from '../../../types';

interface ComponentSelectProps {
  components: T.SerializedComponent[];
  selected: Maybe<T.SerializedComponent>;
  selectComponent: (id: string) => void;
}

interface ComponentOption {
  value: string;
  label: string;
}

const toOption = (b: T.SerializedComponent): ComponentOption => ({
  value: b.id,
  label: b.state.name,
});

export const ComponentSelect: React.SFC<ComponentSelectProps> = ({
  components,
  selected,
  selectComponent,
}) => (
  <div>
    <Select
      value={selected ? toOption(selected) : null}
      options={components.map(toOption)}
      onChange={o => selectComponent(o.value)}
      placeholder="Components"
    />
  </div>
);
