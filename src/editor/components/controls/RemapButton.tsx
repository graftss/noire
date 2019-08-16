import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import * as events from '../../../display/events';
import * as selectors from '../../../state/selectors';
import * as actions from '../../../state/actions';
import {
  stringifyControllerKey,
  getKeyInputKind,
} from '../../../input/controller';
import { stringifyBinding } from '../../../input/source/bindings';
import {
  getComponentKeyInputKind,
  mappedControllerKey,
  getComponentInputFilter,
} from '../../../display/component';
import { DEFAULT_AXIS_DEADZONE } from '../../../input/source/gamepad';
import { getFilterInputKind } from '../../../display/filter';
import { FloatField } from './FloatField';

export type RemapButtonValue =
  | { kind: 'controller'; controller: T.Controller; key: string }
  | {
      kind: 'component';
      component: T.SerializedComponent;
      componentKey: T.ComponentKey;
    }
  | {
      kind: 'filter';
      component: T.SerializedComponent;
      ref: T.ComponentFilterRef;
      inputKey: string;
      controllerKey: Maybe<T.ControllerKey>;
    };

interface PropsFromState {
  controllersById: Dict<T.Controller>;
  isListening: (s: T.RemapState) => boolean;
}

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  controllersById: selectors.controllersById(state),
  isListening: selectors.isListening(state),
});

interface PropsFromDispatch {
  emitDisplayEvents: (e: T.DisplayEvent[]) => void;
  listenNextInput: (s: T.RemapState) => void;
  updateControllerBinding: (u: T.ControllerBindingUpdate) => void;
}

interface RemapButtonProps extends PropsFromState, PropsFromDispatch {
  value: RemapButtonValue;
}

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    {
      emitDisplayEvents: actions.emitDisplayEvents,
      listenNextInput: actions.listenNextInput,
      updateControllerBinding: actions.updateControllerBinding,
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
      const { component, ref, inputKey } = value;
      const filter = getComponentInputFilter(component, ref) as T.InputFilter;
      const inputKind = getFilterInputKind(filter, inputKey) as T.InputKind;

      return {
        kind: 'filter',
        inputKind,
        componentId: component.id,
        ref,
        key: inputKey,
      };
  }
};

// TODO: find a better place for this
const renderDeadzoneField = (
  value: RemapButtonValue,
  updateControllerBinding: (u: T.ControllerBindingUpdate) => void,
): React.ReactNode => {
  if (value.kind !== 'controller') return null;

  const { controller, key } = value;
  const binding: T.Binding = controller.bindings[key];

  return binding.inputKind === 'axis' ? (
    <FloatField
      defaultValue={DEFAULT_AXIS_DEADZONE}
      initialValue={binding.deadzone}
      precision={3}
      update={(deadzone: number) =>
        updateControllerBinding({
          controllerId: controller.id,
          key,
          binding: { ...binding, deadzone },
        })
      }
    />
  ) : null;
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
  updateControllerBinding,
  value,
  ...propsFromState
}) => {
  const remapTo = computeRemapState(value);

  return (
    <span>
      <button
        onClick={() => {
          listenNextInput(remapTo);
          emitDisplayEvents([events.listenNextInput(remapTo)]);
        }}
      >
        {stringifyValue(value, remapTo, propsFromState)}
      </button>
      {renderDeadzoneField(value, updateControllerBinding)}
    </span>
  );
};

export const RemapButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseRemapButton);
