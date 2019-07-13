import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import {
  controllersById,
  selectedComponentProp,
} from '../../../state/selectors';
import { stringifyControllerKey } from '../../../input/controllers';
import { listenNextInput } from '../../../state/actions';

interface BindingsFieldProps extends PropsFromState, PropsFromDispatch {
  bindings: T.ComponentBinding[];
}

interface PropsFromState {
  componentId: string;
  controllersById: Record<string, T.Controller>;
  inputMap: Record<string, T.ControllerKey>;
  remapState?: T.RemapState;
}

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  componentId: selectedComponentProp(state.display, 'id') as string,
  controllersById: controllersById(state.input),
  inputMap: selectedComponentProp(state.display, 'inputMap') as Record<
    string,
    T.ControllerKey
  >,
  remapState: state.input.remap,
});

interface PropsFromDispatch {
  listenNextInput: (t: T.RemapState) => void;
}

const stringifyKeymap = (
  { inputKind, label }: T.ComponentBinding,
  controllerKeyString: string,
): string => `${label} (${inputKind}): ${controllerKeyString}`;

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators({ listenNextInput }, dispatch);

const BaseBindingsField: React.SFC<BindingsFieldProps> = ({
  bindings,
  componentId,
  controllersById,
  inputMap,
  listenNextInput,
  remapState,
}) => (
  <div>
    {bindings.map(binding => {
      const { inputKind, key: bindingKey } = binding;
      const { controllerId, key: controllerKey } = inputMap[bindingKey];

      const controllerKeyString = stringifyControllerKey(
        controllersById[controllerId],
        controllerKey,
        remapState &&
          remapState.kind === 'component' &&
          remapState.componentId === componentId,
      );

      return (
        <div key={bindingKey}>
          <button
            onClick={() =>
              listenNextInput({
                kind: 'component',
                componentId: componentId,
                inputKind,
              })
            }
          >
            {stringifyKeymap(binding, controllerKeyString)}
          </button>
        </div>
      );
    })}
  </div>
);

export const BindingsField = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseBindingsField);
