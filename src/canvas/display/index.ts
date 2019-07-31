import * as T from '../../types';
import { Component } from '../component/Component';
import { selectEditorOption } from '../../state/actions';
import { selectedComponentProp } from '../../state/selectors';
import { ComponentManager } from './ComponentManager';
import { KonvaComponentPlugin } from './plugin/KonvaComponentPlugin';
import { DisplayEventBus } from './DisplayEventBus';
import { DisplayPlugin } from './plugin/DisplayPlugin';

export class Display {
  private cm: ComponentManager;
  private lastState?: T.DisplayState;
  private plugins: DisplayPlugin[];

  constructor(
    private config: T.NoireConfig,
    private store: T.EditorStore,
    private eventBus: DisplayEventBus,
  ) {
    this.plugins = [new KonvaComponentPlugin(config, this.eventBus)];
    this.cm = new ComponentManager(this.eventBus);

    // // run the subscriber once to sync with initial state
    this.storeSubscriber();
    // store.subscribe(this.storeSubscriber);

    this.eventBus.on({
      kind: 'editorSelectComponent',
      cb: (id: Maybe<string>) => {
        this.eventBus.emit({
          kind: 'componentSelect',
          data: [id !== undefined ? this.cm.findById(id) : id],
        });
      },
    });

    this.eventBus.on({
      kind: 'componentSelect',
      cb: (component: Maybe<Component>) => {
        const id = component && component.id;

        if (id !== selectedComponentProp(this.lastState, 'id')) {
          store.dispatch(
            selectEditorOption({
              kind: 'component',
              id,
            }),
          );
        }
      },
    });

    this.eventBus.on({
      kind: 'stageClick',
      cb: () => {
        store.dispatch(
          selectEditorOption({
            kind: 'component',
            id: undefined,
          }),
        );
      },
    });
  }

  private storeSubscriber = (): void => {
    const newState = this.store.getState().display;
    if (this.lastState !== newState) {
      const lastState = this.lastState;
      this.lastState = newState;
      this.syncWithState(newState, lastState);
    }
  };

  private syncWithState(
    state: T.DisplayState,
    lastState: Maybe<T.DisplayState>,
  ): void {
    const { components } = state;
    const lastSelectedId = selectedComponentProp(lastState, 'id');
    const selectedId = selectedComponentProp(state, 'id');

    if (lastSelectedId !== selectedId) {
      this.eventBus.emit({
        kind: 'componentSelect',
        data: [selectedId ? this.cm.findById(selectedId) : undefined],
      });
    }

    this.cm.sync(components);
  }

  draw(): void {
    this.eventBus.emit({ kind: 'requestDraw' });
  }

  update(input: T.GlobalControllerInput, dt: number): void {
    this.cm.update(input, dt);
  }
}
