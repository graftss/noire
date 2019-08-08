import * as React from 'react';
import * as T from '../../../types';
import { TexturesEditor } from '../TexturesEditor';

interface ComponentTexturesProps {
  component: T.SerializedComponent;
  setDefaultTexture: (
    id: string,
    textureName: string,
    k: T.TextureKind,
  ) => void;
  textureList: readonly string[];
  updateTexture: (
    component: T.SerializedComponent,
    textureName: string,
    key: string,
    value: any,
  ) => void;
}

export const ComponentTextures: React.SFC<ComponentTexturesProps> = ({
  component,
  setDefaultTexture,
  textureList,
  updateTexture,
}) => {
  return (
    <div>
      <div>Textures!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</div>
      <div>
        <TexturesEditor
          setDefaultTexture={(name: string, kind: T.TextureKind) =>
            setDefaultTexture(component.id, name, kind)
          }
          textureList={textureList}
          textureMap={component.graphics.textures}
          update={(name, key, value) =>
            updateTexture(component, name, key, value)
          }
        />
      </div>
    </div>
  );
};
