import * as T from '../../types';
import { BindingManager } from '../BindingManager';
import { Component } from '../../component';
import { ComponentManager } from '../ComponentManager';
import { DisplayPlugin } from './DisplayPlugin';
import { DisplayEventBus } from '../DisplayEventBus';
import { NextInputListener } from '../NextInputListener';

const bindingButton =
  <HTMLButtonElement>document.getElementById('axis-editor-binding');

export class ComponentEditorPlugin extends DisplayPlugin {
  private selected?: Component<any>;

  constructor(
    eventBus: DisplayEventBus,
    private listener: NextInputListener,
    private bm: BindingManager,
    private cm: ComponentManager,
  ) {
    super(eventBus);

    eventBus.on({ kind: 'componentClick', cb: this.onComponentClick });
  }

  private onStageClick = () => {
    this.selected = undefined;
    this.listener.deactivate();
  };

  private onComponentClick = ({ component }) => {
    const { bm, cm, eventBus } = this;
    this.selected = component;

    this.listener.awaitButton((buttonBinding: T.ButtonInputBinding) => {
      const binding: T.Binding = { kind: 'button', binding: buttonBinding };
      const bindingId = bm.add(binding);
      const bindingData: T.BindingData = { binding, id: bindingId };

      cm.setBindingId({ component, bindingId });

      eventBus.emit({
        kind: 'bindingAdd',
        data: [component, bindingData],
      });
    });
  }


}
