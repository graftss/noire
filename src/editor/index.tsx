import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as T from '../types';
import { createStore } from '../state/createStore';
import { DisplayEventBus } from '../display/events/DisplayEventBus';
import { EditorContainer } from './components/EditorContainer';

export interface EditorApp {
  store: T.EditorStore;
  render: () => void;
}

// I'm not really sure how to get around this right now, it seems like
// you need to use the `ReactReduxContext` element from react-redux
const _Editor: any = EditorContainer;

export const createEditorApp = (
  target: HTMLElement,
  eventBus: DisplayEventBus,
): EditorApp => {
  const store: T.EditorStore = createStore(eventBus);

  const render = (): void =>
    ReactDOM.render(
      <Provider store={store}>
        <_Editor />
      </Provider>,
      target,
    );

  return {
    render,
    store,
  };
};
