import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import { controllersById, isListening } from '../../../state/selectors';
import { emitDisplayEvents, listenNextInput } from '../../../state/actions';
import { stringifyControllerKey } from '../../../input/controller';
import { stringifyBinding } from '../../../input/source/bindings';

interface PropsFromState {
  controllersById: Dict<T.Controller>;
  isListening: boolean;
}

interface PropsFromDispatch {
  emitDisplayEvents: (e: T.DisplayEvent[]) => void;
  listenNextInput: (s: T.RemapState) => void;
}

type RemapButtonValue =
  | { kind: 'binding'; binding: Maybe<T.Binding> }
  | { kind: 'controllerKey'; controllerKey: Maybe<T.ControllerKey> };

interface OwnProps extends PropsFromState, PropsFromDispatch {
  remapTo: T.RemapState;
  value: RemapButtonValue;
}

interface RemapButtonProps
  extends PropsFromState,
    PropsFromDispatch,
    OwnProps {}

const mapStateToProps = (
  state: T.EditorState,
  { remapTo }: { remapTo: T.RemapState },
): PropsFromState => ({
  controllersById: controllersById(state.input),
  isListening: isListening(state.input, remapTo),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    {
      emitDisplayEvents,
      listenNextInput,
    },
    dispatch,
  );

const stringifyValue = (
  value: RemapButtonValue,
  { isListening, controllersById }: PropsFromState,
): string => {
  if (isListening) return '(listening...)';

  switch (value.kind) {
    case 'controllerKey':
      return stringifyControllerKey(
        value.controllerKey,
        controllersById,
        false,
      );
    case 'binding':
      return stringifyBinding(value.binding);
  }
};

const BaseRemapButton: React.SFC<RemapButtonProps> = ({
  emitDisplayEvents,
  listenNextInput,
  remapTo,
  value,
  ...propsFromState
}) => (
  <button
    onClick={() => {
      listenNextInput(remapTo);
      emitDisplayEvents([{ kind: 'listenNextInput', data: [remapTo] }]);
    }}
  >
    {stringifyValue(value, propsFromState)}
  </button>
);

export const RemapButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseRemapButton);
