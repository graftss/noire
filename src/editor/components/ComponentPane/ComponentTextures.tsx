import * as React from 'react';
import * as T from '../../../types';
import { TexturesEditor } from '../TexturesEditor';

interface ComponentTexturesProps {
  component: T.SerializedComponent;
  textureList: readonly string[];
  updateComponentTexture: (
    component: T.SerializedComponent,
    textureName: string,
    key: string,
    value: any,
  ) => void;
}

export const ComponentTextures: React.SFC<ComponentTexturesProps> = ({
  component,
  textureList,
  updateComponentTexture,
}) => {
  return (
    <div>
      <div>Textures!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</div>
      <div>
        <TexturesEditor
          textureList={textureList}
          textureMap={component.graphics.textures}
          update={(name, key, value) =>
            updateComponentTexture(component, name, key, value)
          }
        />
      </div>
    </div>
  );
};
