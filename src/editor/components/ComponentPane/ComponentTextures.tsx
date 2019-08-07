import * as React from 'react';
import * as T from '../../../types';

interface ComponentTexturesProps {
  component: T.SerializedComponent;
}

export const ComponentTextures: React.SFC<ComponentTexturesProps> = ({
  component,
}) => (
  <div>
    <div>Textures!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</div>
    <div>{JSON.stringify(component.graphics.textures)}</div>
  </div>
);
