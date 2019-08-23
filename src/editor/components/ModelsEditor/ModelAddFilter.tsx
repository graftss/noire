import * as React from 'react';
import * as T from '../../../types';
import { FilterKindSelect } from '../FilterEditor/FilterKindSelect';

interface ModelAddFilterProps {
  addFilter: (kind: T.InputFilterKind) => void;
}

export const ModelAddFilter: React.SFC<ModelAddFilterProps> = ({
  addFilter,
}) => (
  <div>
    new filter:
    <FilterKindSelect
      buttonText="add filter"
      handleSelection={addFilter}
      initialValue={undefined}
    />
  </div>
);
