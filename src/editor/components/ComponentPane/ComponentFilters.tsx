import * as React from 'react';
import * as T from '../../../types';
import { toPairs } from '../../../utils';

interface ComponentFiltersProps {
  filterDict: T.SerializedComponentFilterDict;
}

const renderShapeFilters = (
  shape: string,
  filters: T.SerializedComponentFilter<T.InputFilterKind>[],
): React.ReactNode => (
  <div>
    {`${shape}:`}
    {filters.map((f, i) => (
      <div key={i}> {JSON.stringify(f)} </div>
    ))}
  </div>
);

export const ComponentFilters: React.SFC<ComponentFiltersProps> = ({
  filterDict,
}) => (
  <div>
    {toPairs(filterDict).map(([shape, filters]) => (
      <div key={shape}> {renderShapeFilters(shape, filters)} </div>
    ))}
  </div>
);
