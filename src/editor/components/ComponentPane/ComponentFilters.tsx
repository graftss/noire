import * as React from 'react';
import * as T from '../../../types';
import { toPairs } from '../../../utils';
import { filterInputKinds } from '../../../canvas/filter';
import { stringifyControllerKey } from '../../../input/controller';

interface ComponentFiltersProps {
  component: T.SerializedComponent;
  controllersById: Dict<T.Controller>;
  filterDict: T.SerializedComponentFilterDict;
  listenNextInput: (s: T.RemapState) => void;
  remapState: Maybe<T.RemapState>;
}

const isListening = (
  remapState: Maybe<T.RemapState>,
  componentId: string,
  shape: string,
  filterIndex: number,
  filterKey: string,
): boolean =>
  remapState !== undefined &&
  remapState.kind === 'filter' &&
  remapState.componentId === componentId &&
  remapState.shape === shape &&
  remapState.filterIndex === filterIndex &&
  remapState.filterKey === filterKey;

export const ComponentFilters: React.SFC<ComponentFiltersProps> = ({
  component,
  controllersById,
  filterDict,
  listenNextInput,
  remapState,
}) => (
  <div>
    {toPairs(filterDict).map(([shape, filters]) => (
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
                      <button
                        onClick={() =>
                          listenNextInput({
                            kind: 'filter',
                            componentId: component.id,
                            inputKind,
                            shape,
                            filterIndex,
                            filterKey,
                          })
                        }
                      >
                        {stringifyControllerKey(
                          inputMap[filterKey],
                          controllersById,
                          false,
                          isListening(
                            remapState,
                            component.id,
                            shape,
                            filterIndex,
                            filterKey,
                          ),
                        )}
                      </button>
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
