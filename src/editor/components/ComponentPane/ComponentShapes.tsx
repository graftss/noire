import * as React from 'react';
import * as T from '../../../types';

interface ComponentShapesProps {
  component: T.SerializedComponent;
  shapeList: readonly string[];
}

export const ComponentShapes: React.SFC<ComponentShapesProps> = ({
  component,
  shapeList,
}) => (
  <div>
    {shapeList.map((shapeName: string) => (
      <div key={shapeName}>
        {shapeName}: {JSON.stringify(component.graphics.shapes[shapeName])}
      </div>
    ))}
  </div>
);
