import * as React from 'react';
import * as T from '../../../types';
import { getTextureFields } from '../../../display/texture';
import { EditorField } from '../controls/EditorField';

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

const Texture = ({
  name,
  texture,
  update,
}: {
  name: string;
  texture: Maybe<T.SerializedTexture>;
  update: (key: string, value: any) => void;
}): JSX.Element =>
  !texture ? (
    <div></div>
  ) : (
    <div>
      <div>{name}</div>
      {getTextureFields(texture.kind).map(field => (
        <div key={field.key}>
          <EditorField
            field={field}
            defaultValue={field.getter(texture)}
            update={value => update(field.key, value)}
          />
        </div>
      ))}
    </div>
  );

export const ComponentTextures: React.SFC<ComponentTexturesProps> = ({
  component,
  textureList,
  updateComponentTexture,
}) => {
  return (
    <div>
      <div>Textures!!!!!!!!!!!!!!!!!!!!!!!!!!!!!</div>
      <div>
        {textureList.map(name => (
          <Texture
            key={name}
            name={name}
            texture={component.graphics.textures[name]}
            update={(key: string, value) =>
              updateComponentTexture(component, name, key, value)
            }
          />
        ))}
      </div>
    </div>
  );
};
