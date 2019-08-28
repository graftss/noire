import * as React from 'react';
import * as T from '../../../types';
import { FilterEditor } from '../FilterEditor';
import { getInputFilterControllerKey } from '../../../display/filter';
import {
  getComponentInputFilter,
  mapComponentFilters,
} from '../../../display/component';
import { Section } from '../layout/Section';

interface ComponentFiltersProps {
  component: T.SerializedComponent;
  removeFilter: CB1<{ id: string; ref: T.ComponentFilterRef }>;
  setDefaultFilter: CB1<{
    component: T.SerializedComponent;
    ref: T.ComponentFilterRef;
    kind: T.InputFilterKind;
  }>;
  setFilter: CB1<{
    id: string;
    ref: T.ComponentFilterRef;
    filter: T.InputFilter;
  }>;
}

export const ComponentFilters: React.SFC<ComponentFiltersProps> = ({
  component,
  removeFilter,
  setDefaultFilter,
  setFilter,
}) => (
  <Section>
    {mapComponentFilters(
      (filter, ref, key) => (
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
              remove={() => removeFilter({ id: component.id, ref })}
              setDefaultFilter={kind =>
                setDefaultFilter({ component, ref, kind })
              }
              update={filter => setFilter({ id: component.id, ref, filter })}
            />
          </div>
        </div>
      ),
      component,
    )}
  </Section>
);
