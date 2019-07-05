import DisplayPlugin from './DisplayPlugin';
import DisplayEventBus from '../DisplayEventBus';

export default class ComponentEditorPlugin extends DisplayPlugin {
  constructor(eventBus: DisplayEventBus) {
    super(eventBus);

    eventBus.on({ kind: 'componentClick', cb: (c) => {
      const { component } = c
    }})
  }
}
