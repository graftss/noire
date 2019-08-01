import * as React from 'react';
import * as T from '../../../types';
import { toPairs } from '../../../utils';
import { getInputFilterKeyList } from '../../../canvas/filter';
import { RemapButton } from '../controls/RemapButton';

interface ComponentFiltersProps {
  component: T.SerializedComponent;
}

export const ComponentFilters: React.SFC<ComponentFiltersProps> = ({
  component,
}) =>
  !component.filters ? null : (
    <div>
      {toPairs(component.filters).map(([shape, filters]) => (
        <div key={shape}>
          <div>
            {`${shape}:`}
            {filters.map(({ filter, inputMap }, filterIndex) => (
              <div key={filterIndex}>
                <div>{filter.kind}</div>
                <div>{JSON.stringify(filter.config)}</div>
                <div>
                  {getInputFilterKeyList(filter).map(({ filterKey }) => (
                    <div key={filterKey}>
                      {filterKey}:
                      <RemapButton
                        value={{
                          kind: 'filter',
                          component,
                          controllerKey: inputMap[filterKey],
                          shape,
                          filterIndex,
                          filterKey,
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
