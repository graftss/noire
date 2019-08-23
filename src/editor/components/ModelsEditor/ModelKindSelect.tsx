import * as React from 'react';
import * as T from '../../../types';
import { getKonvaModelKinds } from '../../../display/model/konva';
import { SelectField } from '../controls/SelectField';

interface ModelKindSelectProps {
  buttonText: string;
  initialValue?: Maybe<T.KonvaModelKind>;
  setDefaultModel: (k: T.KonvaModelKind) => void;
}

interface ModelKindOption {
  label: string;
  value: string;
}

const toOption = (k: string): ModelKindOption => ({ value: k, label: k });

export const ModelKindSelect: React.SFC<ModelKindSelectProps> = ({
  buttonText,
  initialValue,
  setDefaultModel,
}) => (
  <div>
    <SelectField
      buttonText={buttonText}
      data={getKonvaModelKinds()}
      initialValue={initialValue}
      onConfirm={(c: Maybe<T.KonvaModelKind>) => c && setDefaultModel(c)}
      placeholder="model class"
      toOption={toOption}
    />
  </div>
);
