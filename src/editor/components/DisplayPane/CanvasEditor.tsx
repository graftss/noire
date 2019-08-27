import * as React from 'react';
import * as T from '../../../types';
import { Vec2Field } from '../controls/Vec2Field';

interface CanvasEditorProps {
  display: T.SerializedDisplay;
  setCanvasDimensions: CB1<{ width: number; height: number }>;
}

export const renderUnsetDimensionsWarning = (width, height): React.ReactNode =>
  !width || !height ? (
    <span>
      <b>set canvas dimensions!!! </b>
    </span>
  ) : null;

export const CanvasEditor: React.SFC<CanvasEditorProps> = ({
  display: { width, height },
  setCanvasDimensions,
}) => (
  <div>
    {renderUnsetDimensionsWarning(width, height)}
    canvas size:{' '}
    <Vec2Field
      defaultValue={{ x: 0, y: 0 }}
      initialValue={{ x: width, y: height }}
      update={({ x, y }) => setCanvasDimensions({ width: x, height: y })}
    />
  </div>
);
