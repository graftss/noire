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
    {bindings.map(componentBinding => {
      const { inputKind, key } = componentBinding;
      const controllerId: Maybe<string> =
        inputMap[key] && inputMap[key].controllerId;
      const controllerKey: Maybe<string> = inputMap[key] && inputMap[key].key;

      const controllerKeyString = stringifyControllerKey(
        controllersById[controllerId],
        controllerKey,
        remapState &&
          remapState.kind === 'component' &&
          remapState.componentId === componentId &&
          remapState.key === componentBinding.key,
      );

      return (
        <div key={key}>
          <button
            onClick={() =>
              listenNextInput({
                kind: 'component',
                componentId: componentId,
                inputKind,
                key,
              })
            }
          >
            {stringifyKeymap(componentBinding, controllerKeyString)}
          </button>
        </div>
      );
    })}
  </div>
);

export const BindingsField = connect(
  mapStateToProps,
  mapDispatchToProps,
  undefined,
  { areStatesEqual: () => false },
)(BaseBindingsField);
