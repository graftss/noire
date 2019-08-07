import * as React from 'react';
import { FloatField } from './FloatField';

interface Vec2FieldProps {
  initialValue: Vec2;
  precision?: number;
  update: (value: Vec2) => void;
}

export const Vec2Field: React.SFC<Vec2FieldProps> = ({
  initialValue,
  precision,
  update,
}) => (
  <span>
    <FloatField
      initialValue={initialValue.x}
      precision={precision}
      update={newX => update({ x: newX, y: initialValue.y })}
    />
    <FloatField
      initialValue={initialValue.y}
      precision={precision}
      update={newY => update({ x: initialValue.x, y: newY })}
    />
  </span>
);
