// I think it makes sense to elide the type checker here for
// the benefits of genericity and brevity
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as T from '../../types';
import { Keyboard } from './keyboard/Keyboard';
import { gamepadSourceFactory } from './gamepad';
import { keyboardSourceFactory } from './keyboard';

export interface GlobalSourceGetters {
  gamepad: () => Maybe<Gamepad>[];
  keyboard: () => Maybe<Keyboard>;
}

export type GlobalInputSnapshot<IK extends T.InputKind> = Maybe<
  T.InputSnapshot[IK]
>[];

export class GlobalInputSources {
  private sources: Record<T.SourceKind, T.InputSource> & {
    gamepad: T.GamepadSource;
    keyboard: T.KeyboardSource;
  };

  constructor(sourceGetters: GlobalSourceGetters) {
    this.sources = {
      gamepad: gamepadSourceFactory(sourceGetters.gamepad),
      keyboard: keyboardSourceFactory(sourceGetters.keyboard),
    };
  }

  private getSource = (kind: T.SourceKind): T.InputSource => this.sources[kind];

  private getGlobalSourceRefs = (): T.SourceRef[] => {
    const result: T.SourceRef[] = [];

    for (const kind in this.sources) {
      for (const ref of this.sources[kind].getSourceRefs()) {
        result.push(ref);
      }
    }

    return result;
  };

  dereference = (ref: T.SourceRef): T.SourceContainer =>
    this.getSource(ref.kind).dereference(ref as any);

  parseBinding = (b: T.Binding): Maybe<T.Input> =>
    this.getSource(b.sourceKind).parseBinding(b as any);

  sourceExists = (s: T.SourceContainer): boolean =>
    this.getSource(s.kind).exists(s as any);

  snapshotSourceInput = <IK extends T.InputKind>(
    ref: T.SourceRef,
    inputKind: IK,
  ): Maybe<T.InputSnapshot[IK]> =>
    (this.getSource(ref.kind).snapshotInput as any)(ref, inputKind);

  snapshotSourceDiff = <IK extends T.InputKind>(
    inputKind: IK,
    ref: T.SourceRef,
    input: T.InputSnapshot[IK],
    baseline: T.InputSnapshot[IK],
  ): Maybe<T.BindingOfInputType<IK>> =>
    (this.getSource(ref.kind).snapshotBindingDiff as any)(
      ref,
      inputKind,
      input,
      baseline,
    );

  snapshotInput = <IK extends T.InputKind>(
    inputKind: IK,
  ): GlobalInputSnapshot<IK> =>
    this.getGlobalSourceRefs().map(r => this.snapshotSourceInput(r, inputKind));

  snapshotDiff = <IK extends T.InputKind>(
    inputKind: IK,
    input: GlobalInputSnapshot<IK>,
    baseline: GlobalInputSnapshot<IK>,
  ): Maybe<T.BindingOfInputType<IK>> => {
    const refs = this.getGlobalSourceRefs();

    for (let index = 0; index < refs.length; index++) {
      if (input[index] && baseline[index]) {
        const binding = this.snapshotSourceDiff(
          inputKind,
          refs[index],
          input[index] as T.InputSnapshot[IK],
          baseline[index] as T.InputSnapshot[IK],
        );

        if (binding) return binding;
      }
    }
  };
}
