import * as React from 'react';
import * as T from '../../../types';
import { SelectField } from '../controls/SelectField';

interface DisplaySelectProps {
  displays: T.SerializedDisplay[];
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
  selectedDisplay,
}) => (
  <div>
    <SelectField
      data={displays}
      initialValue={selectedDisplay}
      onConfirm={d => console.log('selected display', d)}
      placeholder="saved displays"
      toOption={toOption}
    />
  </div>
);
