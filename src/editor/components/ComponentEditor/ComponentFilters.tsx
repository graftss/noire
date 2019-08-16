import * as React from 'react';
import * as T from '../../../types';
import { FilterEditor } from '../FilterEditor';
import { getInputFilterControllerKey } from '../../../display/filter';
import {
  getComponentInputFilter,
  mapComponentFilters,
} from '../../../display/component';

interface ComponentFiltersProps {
  component: T.SerializedComponent;
  setDefaultFilter: (
    component: T.SerializedComponent,
    ref: T.ComponentFilterRef,
    kind: T.InputFilterKind,
  ) => void;
  updateFilter: (
    component: T.SerializedComponent,
    ref: T.ComponentFilterRef,
    filter: T.InputFilter,
  ) => void;
}

export const ComponentFilters: React.SFC<ComponentFiltersProps> = ({
  component,
  setDefaultFilter,
  updateFilter,
}) => (
  <div>
    {mapComponentFilters((filter, ref, key) => {
      return (
        <div key={key}>
          <div>
            <FilterEditor
              filter={filter}
              getRemapButtonValue={inputKey => {
                const filter = getComponentInputFilter(
                  component,
                  ref,
                ) as T.InputFilter;
                const controllerKey = getInputFilterControllerKey(
                  filter,
                  inputKey,
                );
                return {
                  kind: 'filter',
                  component,
                  controllerKey,
                  ref,
                  inputKey,
                };
              }}
              setDefaultFilter={kind => setDefaultFilter(component, ref, kind)}
              update={filter => updateFilter(component, ref, filter)}
            />
          </div>
        </div>
      );
    }, component)}
  </div>
);
