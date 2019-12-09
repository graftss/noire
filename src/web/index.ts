import './index.css';

import { Noire } from '../noire';

const test = new Noire({
  width: 400,
  height: 700,
  editorTarget: document.getElementById('editor') as HTMLElement,
  canvasTarget: document.getElementById('canvas') as HTMLDivElement,
});

test.init();
