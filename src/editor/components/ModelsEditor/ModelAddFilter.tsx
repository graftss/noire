import * as React from 'react';
import * as T from '../../../types';
import { FilterKindSelect } from '../FilterEditor/FilterKindSelect';

interface ModelAddFilterProps {
  addFilter: CB1<T.InputFilterKind>;
  importNewFilter: CB0;
}

export const ModelAddFilter: React.SFC<ModelAddFilterProps> = ({
  addFilter,
  importNewFilter,
}) => (
  <div className="flex-container">
    <button onClick={importNewFilter}>import new filter</button>
    <span className="center">add new filter:</span>
    <span className="flex-rest">
      <FilterKindSelect
        buttonText="add filter"
        handleSelection={addFilter}
        initialValue={undefined}
      />
    </span>
  </div>
);
