import * as React from 'react';
import { FloatField } from './FloatField';

interface Vec2FieldProps {
  defaultValue: Vec2;
  precision?: number;
  update: (value: Vec2) => void;
}

export const Vec2Field: React.SFC<Vec2FieldProps> = ({
  defaultValue,
  precision,
  update,
}) => (
  <span>
    <FloatField
      defaultValue={defaultValue.x}
      precision={precision}
      update={newX => update({ x: newX, y: defaultValue.y })}
    />
    <FloatField
      defaultValue={defaultValue.y}
      precision={precision}
      update={newY => update({ x: defaultValue.x, y: newY })}
    />
  </span>
);
