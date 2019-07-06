import Konva from 'konva';

import * as T from '../../types';
import { applyBinding } from '../gamepad/applyBinding';
import { ComponentManager } from './ComponentManager';
import { ComponentTransformerPlugin } from './plugin/ComponentTransformerPlugin';
import { DisplayEventBus } from './DisplayEventBus';
import { DisplayPlugin } from './plugin/DisplayPlugin';
import { NextInputListener } from './NextInputListener';
import { deserializeComponent } from '../component/deserializeComponent';
import { selectComponent, deselectComponent } from '../../state/actions';
import { find } from '../../utils';

export class Display {
  private nextInputListener: NextInputListener;
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
    this.nextInputListener = new NextInputListener();
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
      cb: (component: T.Component) => {
        if (this.lastState.selectedComponentId !== component.getId()) {
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

  private syncWithState(state: T.DisplayState, lastState: T.DisplayState): void {
    const { components, selectedComponentId } = state;
    const lastSelectedComponentId: string | undefined = lastState && lastState.selectedComponentId;

    if (selectedComponentId && lastSelectedComponentId !== selectedComponentId) {
      this.eventBus.emit({
        kind: 'componentSelect',
        data: [this.cm.findById(selectedComponentId)],
      })
    }

    this.cm.sync(components.map(deserializeComponent));
  }

  private getInputDict(gamepad: Gamepad): Record<T.BindingId, T.Input> {
    const result = {};

    this.lastState.bindings.forEach(
      ({ id, binding }) => (result[id] = applyBinding(binding, gamepad)),
    );

    return result;
  }

  draw(): void {
    this.layer.draw();
  }

  update(gamepad: Gamepad, dt: number): void {
    this.nextInputListener.update(gamepad);

    const inputDict = this.getInputDict(gamepad);
    this.cm.update(inputDict, dt);
  }
}
