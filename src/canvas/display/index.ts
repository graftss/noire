import Konva from 'konva';

import * as T from '../../types';
import { ComponentManager } from './ComponentManager';
import { ComponentTransformerPlugin } from './plugin/ComponentTransformerPlugin';
import { DisplayEventBus } from './DisplayEventBus';
import { DisplayPlugin } from './plugin/DisplayPlugin';
import { Component } from '../component/Component';
import { selectComponent, deselectComponent } from '../../state/actions';
import { selectedComponentProp } from '../../state/stateMaps';

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
      cb: (component: Component) => {
        console.log('selected', component);
        if (selectedComponentProp(this.lastState, 'id') !== component.getId()) {
          store.dispatch(selectComponent(component.getId()));
        }
      },
    });

    this.eventBus.on({
      kind: 'stageClick',
      cb: () => {
        store.dispatch(deselectComponent());
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
    const { components, selectedComponent } = state;
    const lastSelectedId = selectedComponentProp(lastState, 'id');
    const selectedId = selectedComponentProp(state, 'id');

    if (selectedId && lastSelectedId !== selectedId) {
      this.eventBus.emit({
        kind: 'componentSelect',
        data: [this.cm.findById(selectedComponent.id)],
      });
    }

    this.cm.sync(components);
  }

  draw(): void {
    this.layer.draw();
  }

  update(input: T.AllInput, dt: number): void {
    this.cm.update(input, dt);
  }
}
