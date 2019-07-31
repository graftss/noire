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

const controllerKeyStr = (
  controllerKey: Maybe<T.ControllerKey>,
  controllersById: Dict<T.Controller>,
  listening: boolean,
): string => {
  if (listening) return '(listening...)';
  if (!controllerKey) return 'NONE';

  const { controllerId, key } = controllerKey;
  const controller: T.Controller = controllersById[controllerId];
  return stringifyControllerKey(controller, key);
};

const getRemapState = (
  component: T.SerializedComponent,
  inputKind: T.InputKind,
  shape: string,
  filterIndex: number,
): T.RemapState => ({
  kind: 'filter',
  componentId: component.id,
  shape,
  filterIndex,
  inputKind,
});

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
          {filters.map(({ filter, inputMap }, i) => (
            <div key={i}>
              <div>{filter.kind}</div>
              <div>{JSON.stringify(filter.config)}</div>
              <div>
                {toPairs(filterInputKinds(filter)).map(
                  ([key, inputKind], index) => (
                    <div key={key}>
                      {key}:
                      <button
                        onClick={() =>
                          listenNextInput(
                            getRemapState(component, inputKind, shape, index),
                          )
                        }
                      >
                        {controllerKeyStr(
                          inputMap[key],
                          controllersById,
                          false,
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
