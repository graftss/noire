import * as React from 'react';
import * as T from '../../../types';
import { toPairs } from '../../../utils';
import { filterInputKinds } from '../../../canvas/filter';
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
                  {toPairs(filterInputKinds(filter)).map(
                    ([filterKey, inputKind]) => (
                      <div key={filterKey}>
                        {filterKey}:
                        <RemapButton
                          value={{
                            kind: 'controllerKey',
                            controllerKey: inputMap[filterKey],
                          }}
                          remapTo={{
                            kind: 'filter',
                            componentId: component.id,
                            inputKind,
                            shape,
                            filterIndex,
                            filterKey,
                          }}
                        />
                      </div>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
