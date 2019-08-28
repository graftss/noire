import * as React from 'react';
import * as T from '../../../types';
import { FilterKindSelect } from '../FilterEditor/FilterKindSelect';

interface ModelAddFilterProps {
  addFilter: (kind: T.InputFilterKind) => void;
}

export const ModelAddFilter: React.SFC<ModelAddFilterProps> = ({
  addFilter,
}) => (
  <div className="flex-container">
    <span className="center">add filter:</span>
    <span className="flex-rest">
      <FilterKindSelect
        buttonText="add filter"
        handleSelection={addFilter}
        initialValue={undefined}
      />
    </span>
  </div>
);
