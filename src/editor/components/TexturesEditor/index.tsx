import * as React from 'react';
import * as T from '../../../types';
import { TextureEditor } from './TextureEditor';

interface TextureEditorProps<TS extends readonly string[]> {
  textureMap: Record<TS[number], T.SerializedTexture>;
  textureList: TS;
  update: (textureName: string, key: string, value: any) => void;
}

export function TexturesEditor<TS extends readonly string[]>({
  textureList,
  textureMap,
  update,
}: TextureEditorProps<TS>): JSX.Element {
  return (
    <div>
      {textureList.map(name => (
        <TextureEditor
          key={name}
          name={name}
          texture={textureMap[name]}
          update={(key: string, value) => update(name, key, value)}
        />
      ))}
    </div>
  );
}
