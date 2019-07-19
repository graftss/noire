import * as React from 'react';
import Select from 'react-select';
import * as T from '../../../types';

interface AddComponentProps {
  componentKinds: T.ComponentKind[];
  addComponent: (k: T.ComponentKind) => void;
}

interface ComponentKindOption {
  value: T.ComponentKind;
  label: T.ComponentKind;
}

const toOption = (kind: T.ComponentKind): ComponentKindOption => ({
  value: kind,
  label: kind,
});

export const AddComponent: React.SFC<AddComponentProps> = ({
  addComponent,
  componentKinds,
}) => {
  const [kind, setKind] = React.useState(componentKinds[0]);

  const onButtonClick = (): void => {
    addComponent(kind);
  };

  return (
    <div>
      <Select
        value={toOption(kind)}
        options={componentKinds.map(toOption)}
        onChange={o => setKind(o.value)}
        placeholder="Add component"
      />
      <button onClick={onButtonClick}>add</button>
    </div>
  );
};
