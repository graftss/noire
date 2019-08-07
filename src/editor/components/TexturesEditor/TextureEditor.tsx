import * as React from 'react';
import * as T from '../../../types';
import { getTextureFields } from '../../../display/texture';
import { EditorField } from '../controls/EditorField';

interface TextureEditorProps {
  name: string;
  texture: Maybe<T.SerializedTexture>;
  update: (key: string, value: any) => void;
}

export const TextureEditor: React.SFC<TextureEditorProps> = ({
  name,
  texture,
  update,
}) =>
  texture === undefined ? (
    <div></div>
  ) : (
    <div>
      <div>{name}</div>
      {getTextureFields(texture.kind).map(field => (
        <div key={field.key}>
          <EditorField
            field={field}
            initialValue={field.getter(texture)}
            update={value => update(field.key, value)}
          />
        </div>
      ))}
    </div>
  );
