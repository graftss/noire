import * as React from 'react';
import * as T from '../../../types';
import { getTextureFields } from '../../../display/texture';
import { EditorField } from '../controls/EditorField';
import { TextureKindSelect } from './TextureKindSelect';

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
          <TextureKindSelect initialValue={texture.kind} />
          <EditorField
            field={field}
            initialValue={field.getter(texture)}
            update={value => update(field.key, value)}
          />
        </div>
      ))}
    </div>
  );
