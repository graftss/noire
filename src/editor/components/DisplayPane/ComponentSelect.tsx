import * as React from 'react';
import { EditorSelect } from '../controls/EditorSelect';
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
  label: b.state.name || 'Unnamed component',
});

export const ComponentSelect: React.SFC<ComponentSelectProps> = ({
  components,
  selected,
  selectComponent,
}) => (
  <div className="flex-container">
    <span className="center">selected component:</span>
    <span className="flex-rest">
      <EditorSelect
        data={components}
        onChange={o => selectComponent(o.value)}
        placeholder="Components"
        selected={selected}
        toOption={toOption}
      />
    </span>
  </div>
);
