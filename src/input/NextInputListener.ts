import * as T from '../types';
import { areBindingsEqual } from './source/bindings';

interface ListeningState<IK extends T.InputKind> {
  inputKind: IK;
  callback: CB1<T.BindingOfInputKind<IK>>;
  baselineInput?: Maybe<T.InputSnapshot[IK]>[];
}

const CONFIRM_AXIS_VALUE_FRAME_COUNT = 7;

export class NextInputListener {
  private state?: ListeningState<T.InputKind>;
  private pollingBaselineInput = false;

  // to dintinguish axis values from buttons, we make sure a
  // consistent axis value is held for multiple frames before
  // accepting it as a binding
  private axisValueFrameCount = 0;
  private potentialAxisValueBinding: Maybe<T.GamepadAxisValueBinding>;

  constructor(
    private snapshotInput: T.GetGlobalInputSnapshot,
    private snapshotDiff: T.GetGlobalSnapshotDiff,
  ) {}

  await<IK extends T.InputKind>(
    inputKind: IK,
    callback: CB1<T.BindingOfInputKind<IK>>,
  ): void {
    this.state = { inputKind, callback };
    this.pollingBaselineInput = true;
  }

  private resetAxisValueFrameCount(): void {
    this.axisValueFrameCount = 0;
    this.potentialAxisValueBinding = undefined;
  }

  private updateAxisValueFrameCount(b: Maybe<T.Binding>): void {
    if (
      b === undefined ||
      b.sourceKind !== 'gamepad' ||
      b.kind !== 'axisValue'
    ) {
      return this.resetAxisValueFrameCount();
    }

    if (!areBindingsEqual(b, this.potentialAxisValueBinding)) {
      this.resetAxisValueFrameCount();
    }

    if (this.potentialAxisValueBinding === undefined) {
      this.potentialAxisValueBinding = b;
    }

    this.axisValueFrameCount += 1;
  }

  private confirmingAxisValue = (): boolean =>
    this.potentialAxisValueBinding !== undefined &&
    this.axisValueFrameCount < CONFIRM_AXIS_VALUE_FRAME_COUNT;

  deactivate(): void {
    this.pollingBaselineInput = false;
    this.state = undefined;
    this.resetAxisValueFrameCount();
  }

  update(): void {
    if (this.state === undefined) return;
    const input = this.snapshotInput(this.state.inputKind);

    if (this.pollingBaselineInput) {
      this.pollingBaselineInput = false;
      this.state.baselineInput = input;
    } else {
      const { baselineInput, callback, inputKind } = this.state;
      const awaitedBinding = this.snapshotDiff(
        inputKind,
        input,
        baselineInput as typeof input,
      );

      this.updateAxisValueFrameCount(awaitedBinding);

      if (awaitedBinding && !this.confirmingAxisValue()) {
        callback(awaitedBinding);
        this.deactivate();
      }
    }
  }
}
