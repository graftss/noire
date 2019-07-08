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

// I'm not really sure how to get around this right now, it seems like
// you need to use the `ReactReduxContext` element from react-redux
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _Editor: any = Editor;

export const createEditorApp = (target: HTMLElement): EditorApp => {
  const store: T.EditorStore = createStore();

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
