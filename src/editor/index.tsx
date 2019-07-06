import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { createStore, EditorStore } from './state/createStore';
import { Editor } from './components/Editor';

export interface EditorApp {
  store: EditorStore;
  render: () => void;
}

export const createEditorApp = (target: HTMLElement): EditorApp => {
  const store: EditorStore = createStore();

  const render = (): void =>
    ReactDOM.render(
      <Provider store={store}>
        <Editor state={store.getState()} />
      </Provider>,
      target,
    );

  return {
    render,
    store,
  };
};
