import * as React from 'react';
import * as T from '../../../types';
import { FiltersEditor } from '../FiltersEditor';
import { toPairs } from '../../../utils';
import { getInputFilterControllerKey } from '../../../display/filter';
import { getComponentInputFilter } from '../../../display/component';

interface ComponentFiltersProps {
  component: T.SerializedComponent;
  setDefaultFilter: (
    component: T.SerializedComponent,
    modelName: string,
    filterIndex: number,
    kind: T.InputFilterKind,
  ) => void;
  updateFilter: (
    component: T.SerializedComponent,
    modelName: string,
    filterIndex: number,
    filter: T.InputFilter,
  ) => void;
}

export const ComponentFilters: React.SFC<ComponentFiltersProps> = ({
  component,
  setDefaultFilter,
  updateFilter,
}) =>
  !component.filters ? null : (
    <div>
      {toPairs(component.filters).map(([modelName, inputFilters = []]) => (
        <div key={modelName}>
          <div>
            <div key={modelName}>
              <FiltersEditor
                filterList={inputFilters}
                getRemapButtonValue={(
                  inputKey: string,
                  filterIndex: number,
                ) => {
                  const filter = getComponentInputFilter(
                    component,
                    modelName,
                    filterIndex,
                  ) as T.InputFilter;
                  const controllerKey = getInputFilterControllerKey(
                    filter,
                    inputKey,
                  );
                  return {
                    kind: 'filter',
                    component,
                    controllerKey,
                    modelName,
                    filterIndex,
                    inputKey,
                  };
                }}
                label={modelName}
                setDefaultFilter={(filterIndex, kind) =>
                  setDefaultFilter(component, modelName, filterIndex, kind)
                }
                update={(filterIndex, filter) =>
                  updateFilter(component, modelName, filterIndex, filter)
                }
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
