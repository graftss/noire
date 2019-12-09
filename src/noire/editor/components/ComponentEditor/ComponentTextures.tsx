import * as React from 'react';
import * as T from '../../../types';
import { TexturesEditor } from '../TexturesEditor';
import { Section } from '../layout/Section';

interface ComponentTexturesProps {
  component: T.SerializedComponent;
  exportTexture: CB1<T.SerializedTexture>;
  importTexture: CB1<{ id: string; textureName: string }>;
  setDefaultTexture: CB1<{
    id: string;
    textureName: string;
    kind: T.TextureKind;
  }>;
  textureList: readonly string[];
  update: CB1<{
    id: string;
    textureName: string;
    texture: T.SerializedTexture;
  }>;
}

export const ComponentTextures: React.SFC<ComponentTexturesProps> = ({
  component: { id, graphics },
  exportTexture,
  importTexture,
  setDefaultTexture,
  textureList,
  update,
}) =>
  textureList.length === 0 ? null : (
    <Section>
      <TexturesEditor
        exportTexture={exportTexture}
        importTexture={textureName => importTexture({ id, textureName })}
        setDefaultTexture={(textureName, kind) =>
          setDefaultTexture({ id, textureName, kind })
        }
        textureList={textureList}
        textureMap={graphics.textures}
        update={(textureName, texture) => update({ id, textureName, texture })}
      />
    </Section>
  );
