import { compose } from 'ramda';

import { mappedApply, mappedEval } from '../utils';
import * as M from '../gamepad/inputMaps';

export interface GamepadBinding {
  ls: M.StickBinding;
  rs: M.StickBinding;
  dpad: M.DPadBinding;
}

export interface GamepadInput {
  ls: M.StickInput;
  rs: M.StickInput;
  dpad: M.DPadInput;
}

const maps = {
  ls: M.stickMap,
  rs: M.stickMap,
  dpad: M.dPadMap,
};

export default compose(mappedEval, mappedApply(maps));
