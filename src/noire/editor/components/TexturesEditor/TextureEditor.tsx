import * as React from 'react';
import * as T from '../../../types';
import { getTextureFields } from '../../../display/texture';
import { EditorField } from '../controls/EditorField';
import { TextureKindSelect } from './TextureKindSelect';

interface TextureEditorProps {
  exportTexture: CB1<T.SerializedTexture>;
  importTexture: CB1<string>;
  name: string;
  setDefaultTexture: (name: string, k: T.TextureKind) => void;
  texture: Maybe<T.SerializedTexture>;
  update: (texture: T.SerializedTexture) => void;
}

export const TextureEditor: React.SFC<TextureEditorProps> = ({
  exportTexture,
  importTexture,
  name,
  setDefaultTexture,
  texture,
  update,
}) =>
  texture === undefined ? null : (
    <div>
      <div>
        Texture: <b>{name}</b>
        <button onClick={() => exportTexture(texture)}>export texture</button>
        <button onClick={() => importTexture(name)}>import texture</button>
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
