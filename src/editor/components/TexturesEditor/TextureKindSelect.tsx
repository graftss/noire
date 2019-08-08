import * as React from 'react';
import * as T from '../../../types';
import { getTextureKinds } from '../../../display/texture';
import { SelectField } from '../controls/SelectField';

interface TextureKindSelectProps {
  initialValue?: Maybe<T.TextureKind>;
  setDefaultTexture: (k: T.TextureKind) => void;
}

interface TextureKindOption {
  label: string;
  value: string;
}

const toOption = (k: string): TextureKindOption => ({ value: k, label: k });

export const TextureKindSelect: React.SFC<TextureKindSelectProps> = ({
  initialValue,
  setDefaultTexture,
}) => (
  <div>
    <SelectField
      data={getTextureKinds()}
      initialValue={initialValue}
      onConfirm={(c: Maybe<T.TextureKind>) => c && setDefaultTexture(c)}
      placeholder="texture class"
      toOption={toOption}
    />
  </div>
);
