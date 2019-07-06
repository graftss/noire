import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { createStore } from '../state/createStore';
import * as T from '../types';
import { Editor } from './components/Editor';

export interface EditorApp {
  store: T.EditorStore;
  render: () => void;
}

export const createEditorApp = (target: HTMLElement): EditorApp => {
  const store: T.EditorStore = createStore();

  const render = (): void =>
    ReactDOM.render(
      <Provider store={store}>
        <Editor />
      </Provider>,
      target,
    );

  return {
    render,
    store,
  };
};
