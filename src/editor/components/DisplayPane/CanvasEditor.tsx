import * as React from 'react';
import * as T from '../../../types';
import { Vec2Field } from '../controls/Vec2Field';

interface CanvasEditorProps {
  display: T.SerializedDisplay;
  setCanvasDimensions: (width: number, height: number) => void;
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
      update={({ x, y }) => setCanvasDimensions(x, y)}
    />
  </div>
);
