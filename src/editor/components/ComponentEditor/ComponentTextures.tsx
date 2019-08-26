import * as React from 'react';
import * as T from '../../../types';
import { TexturesEditor } from '../TexturesEditor';

interface ComponentTexturesProps {
  component: T.SerializedComponent;
  setDefaultTexture: CB1<{
    id: string;
    textureName: string;
    kind: T.TextureKind;
  }>;
  textureList: readonly string[];
  update: CB1<{
    component: T.SerializedComponent;
    textureName: string;
    texture: T.SerializedTexture;
  }>;
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
          setDefaultTexture={(textureName, kind) =>
            setDefaultTexture({ id: component.id, textureName, kind })
          }
          textureList={textureList}
          textureMap={component.graphics.textures}
          update={(textureName, texture) =>
            update({ component, textureName, texture })
          }
        />
      </div>
    </div>
  );
};
