import * as React from 'react';
import * as T from '../../../types';
import { TextureEditor } from './TextureEditor';

interface TextureEditorProps<TS extends readonly string[]> {
  exportTexture: CB1<T.SerializedTexture>;
  importTexture: CB1<string>;
  setDefaultTexture: (textureName: string, k: T.TextureKind) => void;
  textureMap: Record<TS[number], T.SerializedTexture>;
  textureList: TS;
  update: (textureName: string, texture: T.SerializedTexture) => void;
}

export function TexturesEditor<TS extends readonly string[]>({
  exportTexture,
  importTexture,
  setDefaultTexture,
  textureList,
  textureMap,
  update,
}: TextureEditorProps<TS>): JSX.Element {
  return (
    <div>
      {textureList.map(name => (
        <TextureEditor
          exportTexture={exportTexture}
          importTexture={importTexture}
          key={name}
          name={name}
          setDefaultTexture={setDefaultTexture}
          texture={textureMap[name]}
          update={texture => update(name, texture)}
        />
      ))}
    </div>
  );
}
