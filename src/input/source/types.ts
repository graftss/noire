import * as T from '../../types';

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
  getSourceRefs: () => R[];
  dereference: (ref: R) => S;
  parseBinding: (b: B) => Maybe<T.Input>;
  exists: (s: S) => boolean;
  snapshotInput: <IK extends T.InputKind>(ref: R, kind: IK) => Maybe<I[IK]>;
  snapshotBindingDiff: <IK extends T.InputKind>(
    ref: R,
    kind: IK,
    i1: I[IK],
    i2: I[IK],
  ) => Maybe<T.BindingOfInputKind<IK>>;
}

// GS is the type of the input source's means of
// retrieving global input, i.e. global `Gamepad` objects in
// the browser or anobject handling `keydown` and `keyup`
// events.
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
  stringifyBinding: (b: B) => string;
}

export type SourceRef = T.GamepadSourceRef | T.KeyboardSourceRef;

export type SourceContainer =
  | T.GamepadSourceContainer
  | T.KeyboardSourceContainer;

export type InputSource = T.GamepadSource | T.KeyboardSource;

export type InputSourceFactory =
  | T.GamepadSourceFactory
  | T.KeyboardSourceFactory;

export type Binding = T.GamepadBinding | T.KeyboardBinding;

export type BindingOfInputKind<K extends T.InputKind> = Binding & {
  inputKind: K;
};

export type SourceKind = InputSource['kind'];

export type InputSnapshot = T.GamepadInputSnapshot | T.KeyboardInputSnapshot;
