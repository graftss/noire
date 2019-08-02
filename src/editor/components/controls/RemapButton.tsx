import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import { controllersById, isListening } from '../../../state/selectors';
import { emitDisplayEvents, listenNextInput } from '../../../state/actions';
import {
  stringifyControllerKey,
  getKeyInputKind,
} from '../../../input/controller';
import { stringifyBinding } from '../../../input/source/bindings';
import {
  getComponentKeyInputKind,
  getComponentFilterInputKind,
  mappedControllerKey,
} from '../../../canvas/component';

type RemapButtonValue =
  | { kind: 'controller'; controller: T.Controller; key: string }
  | {
      kind: 'component';
      component: T.SerializedComponent;
      componentKey: T.ComponentKey;
    }
  | {
      kind: 'filter';
      component: T.SerializedComponent;
      controllerKey: Maybe<T.ControllerKey>;
      componentFilterKey: T.ComponentFilterKey;
    };

interface PropsFromState {
  controllersById: Dict<T.Controller>;
  isListening: (s: T.RemapState) => boolean;
}

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  controllersById: controllersById(state),
  isListening: isListening(state),
});

interface PropsFromDispatch {
  emitDisplayEvents: (e: T.DisplayEvent[]) => void;
  listenNextInput: (s: T.RemapState) => void;
}

interface RemapButtonProps extends PropsFromState, PropsFromDispatch {
  value: RemapButtonValue;
}

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    {
      emitDisplayEvents,
      listenNextInput,
    },
    dispatch,
  );

const computeRemapState = (value: RemapButtonValue): T.RemapState => {
  switch (value.kind) {
    case 'controller': {
      const { controller, key } = value;
      return {
        kind: 'controller',
        controllerId: controller.id,
        key,
        inputKind: getKeyInputKind(controller.kind, key),
      };
    }

    case 'component': {
      const { component, componentKey } = value;

      return {
        kind: 'component',
        componentId: component.id,
        key: componentKey.key,
        inputKind: getComponentKeyInputKind(component, componentKey),
      };
    }

    case 'filter':
      const { component, componentFilterKey } = value;
      return {
        kind: 'filter',
        inputKind: getComponentFilterInputKind(
          component,
          componentFilterKey,
        ) as T.InputKind,
        componentId: component.id,
        componentFilterKey,
      };
  }
};

const stringifyValue = (
  value: RemapButtonValue,
  remapTo: T.RemapState,
  { controllersById, isListening }: PropsFromState,
): string => {
  if (isListening(remapTo)) return '(listening...)';

  switch (value.kind) {
    case 'controller': {
      const { controller, key } = value;
      return stringifyBinding(controller.bindings[key]);
    }

    case 'component': {
      const { component, componentKey } = value;

      return stringifyControllerKey(
        mappedControllerKey(component, componentKey),
        controllersById,
      );
    }

    case 'filter': {
      const { controllerKey } = value;
      return stringifyControllerKey(controllerKey, controllersById);
    }
  }
};

const BaseRemapButton: React.SFC<RemapButtonProps> = ({
  emitDisplayEvents,
  listenNextInput,
  value,
  ...propsFromState
}) => {
  const remapTo = computeRemapState(value);

  return (
    <button
      onClick={() => {
        listenNextInput(remapTo);
        emitDisplayEvents([{ kind: 'listenNextInput', data: remapTo }]);
      }}
    >
      {stringifyValue(value, remapTo, propsFromState)}
    </button>
  );
};

export const RemapButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseRemapButton);
