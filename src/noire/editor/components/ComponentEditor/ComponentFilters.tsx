import * as React from 'react';
import * as T from '../../../types';
import { FilterEditor } from '../FilterEditor';
import { getInputFilterControllerKey } from '../../../display/filter';
import {
  componentFilterRefName,
  getComponentInputFilter,
  mapComponentFilters,
} from '../../../display/component';
import { Section } from '../layout/Section';

interface ComponentFiltersProps {
  component: T.SerializedComponent;
  exportFilter: CB1<T.InputFilter>;
  importFilter: CB1<{ id: string; ref: T.ComponentFilterRef }>;
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
  exportFilter,
  importFilter,
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
              exportFilter={exportFilter}
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
              name={componentFilterRefName(ref)}
              importFilter={() => importFilter({ id: component.id, ref })}
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
