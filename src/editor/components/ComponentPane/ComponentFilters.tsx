import * as React from 'react';
import * as T from '../../../types';
import { FiltersEditor } from '../FiltersEditor';
import { toPairs } from '../../../utils';
import { getComponentFilterControllerKey } from '../../../display/component';

interface ComponentFiltersProps {
  component: T.SerializedComponent;
  setDefaultFilter: (
    id: string,
    model: string,
    filterIndex: number,
    kind: T.InputFilterKind,
  ) => void;
  updateFilter: (
    component: T.SerializedComponent,
    model: string,
    filterIndex: number,
    key: string,
    value: any,
  ) => void;
}

export const ComponentFilters: React.SFC<ComponentFiltersProps> = ({
  component,
  setDefaultFilter,
  updateFilter,
}) =>
  !component.filters ? null : (
    <div>
      {toPairs(component.filters).map(([model, componentFilters]) => (
        <div key={model}>
          <div>
            <div key={model}>
              <FiltersEditor
                filterList={componentFilters.map(cf => cf.filter)}
                getRemapButtonValue={(
                  filterKey: string,
                  filterIndex: number,
                ) => ({
                  kind: 'filter',
                  component,
                  controllerKey: getComponentFilterControllerKey(component, {
                    model,
                    filterIndex,
                    filterKey,
                  }),
                  componentFilterKey: { model, filterIndex, filterKey },
                })}
                label={model}
                setDefaultFilter={(filterIndex, kind) =>
                  setDefaultFilter(component.id, model, filterIndex, kind)
                }
                update={(...args) => updateFilter(component, model, ...args)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
