import * as T from '../../types';
import { gamepadSource } from './gamepad';

export interface TypedSourceRef<K extends string> {
  kind: K;
}

export interface TypedSourceContainer<K extends string> {
  kind: K;
  ref: TypedSourceRef<K>;
}

export interface TypedBinding<K extends string, R extends TypedSourceRef<K>> {
  sourceKind: K;
  ref: R;
  inputKind: T.InputKind;
}

// K: `kind` identifier of source
// R: reference to source
// S: container of source
// B: binding types
// I: shape of input snapshot
export interface TypedInputSource<
  K extends string,
  R extends TypedSourceRef<K>,
  S extends TypedSourceContainer<K>,
  B extends TypedBinding<K, R>,
  I extends Record<T.InputKind, object>
> {
  kind: K;
  dereference: (ref: R) => S;
  stringifyBinding: (b: Maybe<B>) => string;
  parseBinding: (b: B, s: S) => Maybe<T.Input>;
  exists: (s: S) => boolean;
  bindingsEqual: (b1: B, b2: B) => boolean;
  snapshotInput: <IK extends T.InputKind>(ref: R, kind: IK) => Maybe<I[IK]>;
  snapshotBindingDiff: <IK extends T.InputKind>(
    ref: R,
    kind: IK,
    i1: I[IK],
    i2: I[IK],
  ) => Maybe<T.BindingOfInputType<IK>>;
}

export type SourceRef = T.GamepadSourceRef;

export type SourceContainer = T.GamepadSourceContainer;

export type InputSource = T.GamepadSource;
export type SourceKind = InputSource['kind'];

export type Binding = T.GamepadBinding;
export type BindingOfInputType<K extends T.InputKind> = Binding & {
  inputKind: K;
};

const sources: Record<SourceKind, InputSource> = {
  gamepad: gamepadSource,
};

export interface GlobalSourceRefs {
  gamepads: T.GamepadSourceRef[];
  keyboard: T.KeyboardSourceRef;
}

export interface GlobalInputSnapshot<IK extends T.InputKind> {
  gamepads: Maybe<T.GamepadInputSnapshot[IK]>[];
}

export function dereference(ref: T.GamepadSourceRef): T.GamepadSourceContainer;
export function dereference(ref: SourceRef): SourceContainer {
  switch (ref.kind) {
    case 'gamepad':
      return sources.gamepad.dereference(ref);
  }
}

export const stringifyBinding = (
  sourceKind: SourceKind,
  b: Maybe<Binding>,
): string => sources[sourceKind].stringifyBinding(b);

export const parseBinding = (b: Binding, s: SourceContainer): Maybe<T.Input> =>
  sources[s.kind].parseBinding(b, s);

export const sourceExists = (s: T.SourceContainer): boolean =>
  sources[s.kind].exists(s);

export const areBindingsEqual = (
  b1: Maybe<T.Binding>,
  b2: Maybe<T.Binding>,
): boolean => {
  if (!b1 || !b2) return false;

  if (b1.sourceKind === 'gamepad' && b2.sourceKind === 'gamepad') {
    return sources.gamepad.bindingsEqual(b1, b2);
  }

  return false;
};

export function snapshotInput<K extends T.InputKind>(
  ref: T.GamepadSourceRef,
  inputKind: K,
): Maybe<T.GamepadInputSnapshot[K]>;
export function snapshotInput<K extends T.InputKind>(
  ref: SourceRef,
  inputKind: K,
): Maybe<object> {
  switch (ref.kind) {
    case 'gamepad':
      return sources.gamepad.snapshotInput(ref, inputKind) as Maybe<
        T.GamepadInputSnapshot[K]
      >;
  }
}

export function snapshotBindingDiff<IK extends T.InputKind>(
  ref: T.GamepadSourceRef,
  inputKind: IK,
  input: T.GamepadInputSnapshot[IK],
  baseline: T.GamepadInputSnapshot[IK],
): Maybe<T.BindingOfInputType<IK>>;
export function snapshotBindingDiff<IK extends T.InputKind>(
  ref: SourceRef,
  inputKind: IK,
  input: object,
  baseline: object,
): Maybe<object> {
  switch (ref.kind) {
    case 'gamepad':
      return sources.gamepad.snapshotBindingDiff(
        ref,
        inputKind,
        input as T.GamepadInputSnapshot[IK],
        baseline as T.GamepadInputSnapshot[IK],
      );
  }
}

export const snapshotGlobalInput = <IK extends T.InputKind>(
  refs: T.GlobalSourceRefs,
  inputKind: IK,
): T.GlobalInputSnapshot<IK> => ({
  gamepads: refs.gamepads.map(ref => snapshotInput(ref, inputKind)),
});

export const globalSnapshotBindingDiff = <IK extends T.InputKind>(
  refs: T.GlobalSourceRefs,
  inputKind: IK,
  input: T.GlobalInputSnapshot<IK>,
  baseline: T.GlobalInputSnapshot<IK>,
): Maybe<T.BindingOfInputType<IK>> => {
  for (let index = 0; index < refs.gamepads.length; index++) {
    const i1 = input.gamepads[index];
    const i2 = baseline.gamepads[index];
    if (i1 && i2) {
      const awaitedBinding = snapshotBindingDiff(
        refs.gamepads[index],
        inputKind,
        i1,
        i2,
      );

      if (awaitedBinding) return awaitedBinding;
    }
  }
};
