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
  removeFilter: (id: string, ref: T.ComponentFilterRef) => void;
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
  removeFilter,
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
              getRemapButtonValue={field => {
                const controllerKey = getInputFilterControllerKey(
                  getComponentInputFilter(component, ref) as T.InputFilter,
                  field.key,
                );

                return {
                  kind: 'filter',
                  component,
                  controllerKey,
                  ref,
                  field,
                };
              }}
              remove={() => removeFilter(component.id, ref)}
              setDefaultFilter={kind => setDefaultFilter(component, ref, kind)}
              update={filter => updateFilter(component, ref, filter)}
            />
          </div>
        </div>
      );
    }, component)}
  </div>
);
