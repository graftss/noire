import * as React from 'react';
import { FloatField } from './FloatField';

interface Vec2FieldProps {
  defaultValue: Vec2;
  initialValue: Maybe<Vec2>;
  precision?: number;
  update: (value: Vec2) => void;
}

export const Vec2Field: React.SFC<Vec2FieldProps> = ({
  defaultValue: { x: dx, y: dy },
  initialValue,
  precision,
  update,
}) => (
  <span>
    <FloatField
      defaultValue={dx}
      initialValue={initialValue && initialValue.x}
      precision={precision}
      update={newX =>
        update({ x: newX, y: initialValue ? initialValue.y : dx })
      }
    />
    <FloatField
      defaultValue={dy}
      initialValue={initialValue && initialValue.y}
      precision={precision}
      update={newY =>
        update({ x: initialValue ? initialValue.x : dx, y: newY })
      }
    />
  </span>
);
