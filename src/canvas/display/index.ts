import Konva from 'konva';
import * as T from '../../types';
import { Component } from '../component/Component';
import { selectEditorOption } from '../../state/actions';
import { selectedComponentProp } from '../../state/selectors';
import { ComponentManager } from './ComponentManager';
import { ComponentTransformerPlugin } from './plugin/ComponentTransformerPlugin';
import { DisplayEventBus } from './DisplayEventBus';
import { DisplayPlugin } from './plugin/DisplayPlugin';

export class Display {
  private eventBus: DisplayEventBus;
  private cm: ComponentManager;
  private lastState?: T.DisplayState;
  private plugins: DisplayPlugin[];

  constructor(
    private stage: Konva.Stage,
    private layer: Konva.Layer,
    private store: T.EditorStore,
  ) {
    this.stage = stage;
    this.layer = layer;
    this.eventBus = new DisplayEventBus();
    this.plugins = [new ComponentTransformerPlugin(this.eventBus)];

    this.cm = new ComponentManager(stage, layer, this.eventBus);

    this.checkForStateChange();
    store.subscribe(this.checkForStateChange);

    stage.on('click', ({ target, currentTarget }) => {
      if (target === currentTarget) {
        this.eventBus.emit({
          kind: 'stageClick',
          data: [stage],
        });
      }
    });

    this.eventBus.on({
      kind: 'componentSelect',
      cb: (component: Component | undefined) => {
        const id = component && component.getId();

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

  private checkForStateChange = (): void => {
    const newState = this.store.getState().display;
    if (this.lastState !== newState) {
      const lastState = this.lastState;
      this.lastState = newState;
      this.syncWithState(newState, lastState);
    }
  };

  private syncWithState(
    state: T.DisplayState,
    lastState: T.DisplayState,
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
    this.layer.draw();
  }

  update(input: T.GlobalInput, dt: number): void {
    this.cm.update(input, dt);
  }
}
