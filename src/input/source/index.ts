import * as T from '../../types';
import { gamepadSourceFactory, gamepadBindingAPI } from './gamepad';

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
// I: input snapshot
export interface TypedInputSource<
  K extends string,
  R extends TypedSourceRef<K>,
  S extends TypedSourceContainer<K>,
  B extends TypedBinding<K, R>,
  I extends Record<T.InputKind, object>
> {
  kind: K;
  dereference: (ref: R) => S;
  parseBinding: (b: B, s: S) => Maybe<T.Input>;
  exists: (s: S) => boolean;
  snapshotInput: <IK extends T.InputKind>(ref: R, kind: IK) => Maybe<I[IK]>;
  snapshotBindingDiff: <IK extends T.InputKind>(
    ref: R,
    kind: IK,
    i1: I[IK],
    i2: I[IK],
  ) => Maybe<T.BindingOfInputType<IK>>;
}

// GS is the type of the input source's means of
// retrieving global input, i.e. global `Gamepad` objects in
// the browser or a `Keyboard` object handling `keydown`
// and `keyup` events.
export type TypedInputSourceFactory<
  K extends string,
  R extends TypedSourceRef<K>,
  S extends TypedSourceContainer<K>,
  B extends TypedBinding<K, R>,
  I extends Record<T.InputKind, object>,
  GS
> = (getSource: () => GS) => TypedInputSource<K, R, S, B, I>;

export interface InputSourceBindingAPI<
  K extends string,
  R extends TypedSourceRef<K>,
  B extends TypedBinding<K, R>
> {
  areBindingsEqual: (b1: Maybe<B>, b2: Maybe<B>) => boolean;
  stringifyBinding: (b: Maybe<B>) => string;
}

export type SourceRef = T.GamepadSourceRef;
export type SourceContainer = T.GamepadSourceContainer;
export type InputSource = T.GamepadSource;
export type InputSourceFactory = T.GamepadSourceFactory;
export type Binding = T.GamepadBinding;
export type BindingOfInputType<K extends T.InputKind> = Binding & {
  inputKind: K;
};

export type SourceKind = InputSource['kind'];

export interface GlobalSourceRefs {
  gamepads: T.GamepadSourceRef[];
  keyboard: T.KeyboardSourceRef;
}

export interface GlobalInputSnapshot<IK extends T.InputKind> {
  gamepads: Maybe<T.GamepadInputSnapshot[IK]>[];
}

export interface GlobalSourceGetters {
  gamepad: () => Maybe<Gamepad>[];
}

export const areBindingsEqual = (
  b1: Maybe<T.Binding>,
  b2: Maybe<T.Binding>,
): boolean => {
  if (!b1 || !b2) return false;

  if (b1.sourceKind === 'gamepad' && b2.sourceKind === 'gamepad') {
    return gamepadBindingAPI.areBindingsEqual(b1, b2);
  }

  return false;
};

export const stringifyBinding = (
  sourceKind: SourceKind,
  b: Maybe<Binding>,
): string => {
  switch (sourceKind) {
    case 'gamepad':
      return gamepadBindingAPI.stringifyBinding(b);
  }
};

export class GlobalInputSources {
  private sources: Record<SourceKind, InputSource>;

  constructor(sourceGetters: GlobalSourceGetters) {
    this.sources = {
      gamepad: gamepadSourceFactory(sourceGetters.gamepad),
    };
  }

  dereference(ref: T.GamepadSourceRef): T.GamepadSourceContainer;
  dereference(ref: SourceRef): SourceContainer {
    switch (ref.kind) {
      case 'gamepad':
        return this.sources.gamepad.dereference(ref);
    }
  }

  parseBinding = (b: Binding, s: SourceContainer): Maybe<T.Input> =>
    this.sources[s.kind].parseBinding(b, s);

  sourceExists = (s: T.SourceContainer): boolean =>
    this.sources[s.kind].exists(s);

  snapshotInput<K extends T.InputKind>(
    ref: T.GamepadSourceRef,
    inputKind: K,
  ): Maybe<T.GamepadInputSnapshot[K]>;
  snapshotInput<K extends T.InputKind>(
    ref: SourceRef,
    inputKind: K,
  ): Maybe<object> {
    switch (ref.kind) {
      case 'gamepad':
        return this.sources.gamepad.snapshotInput(ref, inputKind) as Maybe<
          T.GamepadInputSnapshot[K]
        >;
    }
  }

  snapshotBindingDiff<IK extends T.InputKind>(
    ref: T.GamepadSourceRef,
    inputKind: IK,
    input: T.GamepadInputSnapshot[IK],
    baseline: T.GamepadInputSnapshot[IK],
  ): Maybe<T.BindingOfInputType<IK>>;
  snapshotBindingDiff<IK extends T.InputKind>(
    ref: SourceRef,
    inputKind: IK,
    input: object,
    baseline: object,
  ): Maybe<object> {
    switch (ref.kind) {
      case 'gamepad':
        return this.sources.gamepad.snapshotBindingDiff(
          ref,
          inputKind,
          input as T.GamepadInputSnapshot[IK],
          baseline as T.GamepadInputSnapshot[IK],
        );
    }
  }

  snapshotGlobalInput = <IK extends T.InputKind>(
    refs: T.GlobalSourceRefs,
    inputKind: IK,
  ): T.GlobalInputSnapshot<IK> => ({
    gamepads: refs.gamepads.map(ref => this.snapshotInput(ref, inputKind)),
  });

  globalSnapshotBindingDiff = <IK extends T.InputKind>(
    refs: T.GlobalSourceRefs,
    inputKind: IK,
    input: T.GlobalInputSnapshot<IK>,
    baseline: T.GlobalInputSnapshot<IK>,
  ): Maybe<T.BindingOfInputType<IK>> => {
    for (let index = 0; index < refs.gamepads.length; index++) {
      const i1 = input.gamepads[index];
      const i2 = baseline.gamepads[index];
      if (i1 && i2) {
        const awaitedBinding = this.snapshotBindingDiff(
          refs.gamepads[index],
          inputKind,
          i1,
          i2,
        );

        if (awaitedBinding) return awaitedBinding;
      }
    }
  };
}
