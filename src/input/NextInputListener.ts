import * as T from '../types';
import { GlobalInputSources } from './source';

interface ListeningState<IK extends T.InputKind> {
  inputKind: IK;
  callback: CB1<T.BindingOfInputType<IK>>;
  baselineInput?: T.GlobalInputSnapshot<IK>;
}

export class NextInputListener {
  private state?: ListeningState<T.InputKind>;
  private pollingBaselineInput: boolean = false;

  constructor(private globalInputSources: GlobalInputSources) {}

  await<IK extends T.InputKind>(
    inputKind: IK,
    callback: CB1<T.BindingOfInputType<IK>>,
  ): void {
    this.state = { inputKind, callback };
    this.pollingBaselineInput = true;
  }

  isActive(): boolean {
    return this.state !== undefined;
  }

  deactivate(): void {
    this.pollingBaselineInput = false;
    this.state = undefined;
  }

  update(refs: T.GlobalSourceRefs): void {
    if (this.state === undefined) return;
    const input = this.globalInputSources.snapshotGlobalInput(
      refs,
      this.state.inputKind,
    );

    if (this.pollingBaselineInput) {
      this.pollingBaselineInput = false;
      this.state.baselineInput = input;
    } else {
      const awaitedBinding = this.globalInputSources.globalSnapshotBindingDiff(
        refs,
        this.state.inputKind,
        input,
        this.state.baselineInput as T.GlobalInputSnapshot<T.InputKind>,
      );

      if (awaitedBinding) {
        this.state.callback(awaitedBinding);
        this.deactivate();
      }
    }
  }
}
