import * as React from 'react';
import * as T from '../../../types';
import { SelectField } from '../controls/SelectField';

interface DisplaySelectProps {
  displays: T.SerializedDisplay[];
  selectDisplay: (display: T.SerializedDisplay) => void;
  selectedDisplay: Maybe<T.SerializedDisplay>;
}

interface SavedDisplayOption {
  label: string;
  value: string;
}

const toOption = (d: T.SerializedDisplay): SavedDisplayOption => ({
  value: d.id,
  label: d.name,
});

export const DisplaySelect: React.SFC<DisplaySelectProps> = ({
  displays,
  selectDisplay,
  selectedDisplay,
}) => (
  <div>
    <SelectField
      data={displays}
      initialValue={selectedDisplay}
      onConfirm={selectDisplay}
      placeholder="saved displays"
      toOption={toOption}
    />
  </div>
);
