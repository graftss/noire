import * as React from 'react';
import { FloatField } from './FloatField';

interface Vec2FieldProps {
  defaultValue: Vec2;
  precision?: number;
  update: (value: Vec2) => void;
}

export const Vec2Field: React.SFC<Vec2FieldProps> = ({
  defaultValue: { x, y },
  precision,
  update,
}) => (
  <span>
    <FloatField
      defaultValue={x}
      precision={precision}
      update={newX => update({ x: newX, y })}
    />
    <FloatField
      defaultValue={y}
      precision={precision}
      update={newY => update({ x, y: newY })}
    />
  </span>
);
