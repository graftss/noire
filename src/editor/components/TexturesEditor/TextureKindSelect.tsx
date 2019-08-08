import * as React from 'react';
import * as T from '../../../types';
import { getTextureKinds } from '../../../display/texture';
import { SelectField } from '../controls/SelectField';

interface TextureKindSelectProps {
  initialValue?: Maybe<T.TextureKind>;
}

interface TextureKindOption {
  label: string;
  value: string;
}

const toOption = (k: string): TextureKindOption => ({ value: k, label: k });

export const TextureKindSelect: React.SFC<TextureKindSelectProps> = ({
  initialValue,
}) => (
  <div>
    <SelectField
      data={getTextureKinds()}
      initialValue={initialValue}
      onConfirm={c => console.log('kind:', c)}
      placeholder="texture class"
      toOption={toOption}
    />
  </div>
);
