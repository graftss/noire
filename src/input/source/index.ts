import * as T from '../../types';
import { gamepadSource } from './gamepad';
import { mapObj } from '../../utils';

export type TypedSourceRef<K extends string> = { kind: K };

export type TypedSourceContainer<K extends string> = { kind: K, ref: TypedSourceRef<K> }

export type TypedBinding<K extends string, R extends TypedSourceRef<K>> = {
  sourceKind: K;
  ref: R;
  inputKind: T.InputKind;
};

// K: `kind` string identifier of source
// R: reference to source
// S: container of source
// B: binding types
export interface TypedInputSource<
  K extends string,
  R extends TypedSourceRef<K>,
  S extends TypedSourceContainer<K>,
  B extends TypedBinding<K, R>,
> {
  kind: K;
  dereference: (ref: R) => S;
  stringifyBinding: (b: Maybe<B>) => string;
  parseBinding: (b: B, s: S) => Maybe<T.Input>;
  exists: (s: S) => boolean;
  bindingsEqual: (b1: B, b2: B) => boolean
}

export type SourceRef = T.GamepadSourceRef;
export type SourceContainer = T.GamepadSourceContainer;
export type Binding = T.GamepadBinding;
export type InputSource = T.GamepadSource;
export type SourceKind = InputSource['kind'];

const sources: Record<SourceKind, InputSource> = {
  gamepad: gamepadSource,
};

export function dereference(ref: T.GamepadSourceRef): T.GamepadSourceContainer
export function dereference(ref: SourceRef): SourceContainer {
  switch (ref.kind) {
    case 'gamepad': return sources.gamepad.dereference(ref);
  }
}

export const stringifyBinding = (b: Binding): string => (
  sources[b.sourceKind].stringifyBinding(b)
);

export const parseBinding = (b: Binding, s: SourceContainer): Maybe<T.Input> => (
  sources[s.kind].parseBinding(b, s)
);

export const sourceExists = (s: T.SourceContainer): boolean => (
  sources[s.kind].exists(s)
);

export const areBindingsEqual = (b1: Maybe<T.Binding>, b2: Maybe<T.Binding>): boolean => {
  if (!b1 || !b2) return false;

  if (b1.sourceKind === 'gamepad' && b2.sourceKind === 'gamepad') {
    return sources.gamepad.bindingsEqual(b1, b2);
  }

  return false;
};
