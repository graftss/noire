import * as T from '../types';

interface ListeningState<IK extends T.InputKind> {
  inputKind: IK;
  callback: CB1<T.BindingOfInputKind<IK>>;
  baselineInput?: Maybe<T.InputSnapshot[IK]>[];
}

type SnapshotInput = <IK extends T.InputKind>(
  kind: IK,
) => T.GlobalInputSnapshot<IK>;

type SnapshotDiff = <IK extends T.InputKind>(
  kind: IK,
  input: T.GlobalInputSnapshot<IK>,
  baseline: T.GlobalInputSnapshot<IK>,
) => Maybe<T.BindingOfInputKind<IK>>;

export class NextInputListener {
  private state?: ListeningState<T.InputKind>;
  private pollingBaselineInput: boolean = false;

  constructor(
    private snapshotInput: SnapshotInput,
    private snapshotDiff: SnapshotDiff,
  ) {}

  await<IK extends T.InputKind>(
    inputKind: IK,
    callback: CB1<T.BindingOfInputKind<IK>>,
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

  update(): void {
    if (this.state === undefined) return;
    const input = this.snapshotInput(this.state.inputKind);

    if (this.pollingBaselineInput) {
      this.pollingBaselineInput = false;
      this.state.baselineInput = input;
    } else {
      const awaitedBinding = this.snapshotDiff(this.state.inputKind, input, this
        .state.baselineInput as typeof input);

      if (awaitedBinding) {
        this.state.callback(awaitedBinding);
        this.deactivate();
      }
    }
  }
}
