import * as React from 'react';
import * as T from '../../../types';
import { Vec2Field } from '../controls/Vec2Field';

interface CanvasEditorProps {
  display: T.SerializedDisplay;
  setCanvasDimensions: CB1<{ width: number; height: number }>;
}

const defaultCanvasDimensions = { x: 500, y: 700 };

export const CanvasEditor: React.SFC<CanvasEditorProps> = ({
  display: { width, height },
  setCanvasDimensions,
}) => (
  <div>
    canvas size:{' '}
    <Vec2Field
      defaultValue={defaultCanvasDimensions}
      initialValue={{ x: width, y: height }}
      update={({ x, y }) => setCanvasDimensions({ width: x, height: y })}
    />
  </div>
);
