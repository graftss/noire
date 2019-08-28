import * as React from 'react';
import * as T from '../../../types';
import { getTextureFields } from '../../../display/texture';
import { EditorField } from '../controls/EditorField';
import { TextureKindSelect } from './TextureKindSelect';

interface TextureEditorProps {
  name: string;
  setDefaultTexture: (name: string, k: T.TextureKind) => void;
  texture: Maybe<T.SerializedTexture>;
  update: (texture: T.SerializedTexture) => void;
}

export const TextureEditor: React.SFC<TextureEditorProps> = ({
  name,
  setDefaultTexture,
  texture,
  update,
}) =>
  texture === undefined ? null : (
    <div>
      <div>
        Texture: <b>{name}</b>
      </div>
      <TextureKindSelect
        buttonText="set texture type"
        initialValue={texture.kind}
        setDefaultTexture={kind => setDefaultTexture(name, kind)}
      />
      {getTextureFields(texture.kind).map(field => (
        <div key={field.key}>
          <EditorField
            field={field}
            initialValue={field.getter(texture)}
            update={value => update(field.setter(texture, value))}
          />
        </div>
      ))}
    </div>
  );
