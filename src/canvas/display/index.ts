import * as T from '../../types';
import { deserializeComponent } from '../component';
import { selectEditorOption } from '../../state/actions';
import { ComponentManager } from './ComponentManager';
import { KonvaComponentPlugin } from './plugin/KonvaComponentPlugin';
import { DisplayEventBus } from './DisplayEventBus';
import { DisplayPlugin } from './plugin/DisplayPlugin';

export class Display {
  private cm: ComponentManager;
  private plugins: DisplayPlugin[];

  constructor(
    private config: T.NoireConfig,
    private store: T.EditorStore,
    private eventBus: DisplayEventBus,
  ) {
    const { getState, dispatch } = store;

    this.cm = new ComponentManager(this.eventBus);
    this.plugins = [new KonvaComponentPlugin(config, this.eventBus, this.cm)];

    // sync display with the store's initial state
    this.syncWithState(getState());

    this.eventBus.on({
      kind: 'selectComponent',
      cb: (id: Maybe<string>) =>
        dispatch(selectEditorOption({ kind: 'component', id })),
    });

    this.eventBus.on({
      kind: 'stageClick',
      cb: () =>
        dispatch(selectEditorOption({ kind: 'component', id: undefined })),
    });
  }

  private syncWithState(state: T.EditorState): void {
    this.cm.sync(state.display.components.map(deserializeComponent));
  }

  draw(): void {
    this.eventBus.emit({ kind: 'requestDraw', data: undefined });
  }

  update(input: T.GlobalControllerInput, dt: number): void {
    this.cm.update(input, dt);
  }
}
