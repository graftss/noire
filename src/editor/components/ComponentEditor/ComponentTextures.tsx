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
  update: (
    component: T.SerializedComponent,
    textureName: string,
    texture: T.SerializedTexture,
  ) => void;
}

export const ComponentTextures: React.SFC<ComponentTexturesProps> = ({
  component,
  setDefaultTexture,
  textureList,
  update,
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
          update={(name, texture) => update(component, name, texture)}
        />
      </div>
    </div>
  );
};
