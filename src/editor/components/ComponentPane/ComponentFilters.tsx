import * as React from 'react';
import * as T from '../../../types';
import { FiltersEditor } from '../FiltersEditor';
import { toPairs } from '../../../utils';
import {
  getComponentFilterControllerKey,
  updateComponentFilterState,
} from '../../../display/component';

interface ComponentFiltersProps {
  component: T.SerializedComponent;
}

export const ComponentFilters: React.SFC<ComponentFiltersProps> = ({
  component,
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
                setDefaultFilter={kind =>
                  console.log('default filter of kind', kind)
                }
                update={(index: number, key: string, value: any) => {
                  const newState = updateComponentFilterState(
                    component.filters as T.SerializedComponentFilterDict,
                    model,
                    index,
                    key,
                    value,
                  );

                  console.log('new', newState);
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
