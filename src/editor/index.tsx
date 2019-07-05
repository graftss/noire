import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Hello } from './components/Hello';

export const renderEditor = (target: HTMLElement): void => {
  ReactDOM.render(<Hello name="mook" />, target);
};
