import * as React from 'react';
import * as T from '../../../types';
import { getTextureFields } from '../../../display/texture';
import { EditorField } from '../controls/EditorField';

interface ComponentTexturesProps {
  component: T.SerializedComponent;
  textureList: readonly string[];
}

const Texture = ({
  name,
  texture,
}: {
  name: string;
  texture: Maybe<T.SerializedTexture>;
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
            update={v => v}
          />
        </div>
      ))}
    </div>
  );

export const ComponentTextures: React.SFC<ComponentTexturesProps> = ({
  component,
  textureList,
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
          />
        ))}
      </div>
    </div>
  );
};
