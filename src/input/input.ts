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

export type InputKind = Input['kind'];

export type InputKindProjection<I extends Dict<Input>> = {
  [K in keyof I]: I[K]['kind'];
};

export type RawInput = Input['input'];

export type RawInputProjection<I extends Dict<Input>> = Record<
  keyof I,
  RawInput
> &
  {
    [K in keyof I]: I[K]['input'];
  };

export type AllRaw<I extends Dict<Input>> = RawInputProjection<Required<I>>;

export const rawifyInputDict = <I extends Dict<Input>>(
  inputDict: I,
): RawInputProjection<I> => {
  // TODO: is there a way to give the compiler enough information
  // to avoid this cast?
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return mapObj(inputDict, i => i && i.input) as any;
};

export function defaultInputByKind(kind: 'axis'): AxisInput;
export function defaultInputByKind(kind: 'button'): ButtonInput;
export function defaultInputByKind(kind: InputKind): Input {
  switch (kind) {
    case 'axis':
      return { kind, input: 0 };
    case 'button':
      return { kind, input: false };
  }
}
