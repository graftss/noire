import { mapObj } from '../utils';

export type RawAxisInput = number;

export interface AxisInput {
  kind: 'axis';
  input: RawAxisInput;
}

export type RawButtonInput = boolean;

export interface ButtonInput {
  kind: 'button';
  input: RawButtonInput;
}

export type Input = AxisInput | ButtonInput;

export interface RawInputOfKind {
  button: RawButtonInput;
  axis: RawAxisInput;
}

export type KindsToRaw<KS extends Dict<InputKind>> = {
  [K in keyof KS]: RawInputOfKind[KS[K]];
};

export type InputKind = Input['kind'];

export type InputKindProjection<I extends Dict<Input>> = {
  [K in keyof I]: I[K]['kind'];
};

export type RawInput = Input['input'];

export type RawInputProjection<I extends Dict<Input>> = {
  [K in keyof I]: I[K]['input'];
};

export const rawifyInputDict = <I extends Dict<Input>>(
  inputDict: I,
): RawInputProjection<I> => {
  // TODO: is there a way to give the compiler enough information
  // to avoid this cast?
  return mapObj(inputDict, i => i && i.input) as any;
};

export function defaultInputByKind(kind: 'axis'): RawAxisInput;
export function defaultInputByKind(kind: 'button'): RawButtonInput;
export function defaultInputByKind(kind: InputKind): RawInput {
  switch (kind) {
    case 'axis':
      return 0;
    case 'button':
      return false;
  }
}
