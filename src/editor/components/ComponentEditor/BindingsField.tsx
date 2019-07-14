import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import { controllersById, selectedComponent } from '../../../state/selectors';
import { stringifyControllerKey } from '../../../input/controllers';
import { listenNextInput } from '../../../state/actions';

interface PropsFromState {
  componentId?: string;
  controllersById: Dict<T.Controller>;
  inputMap?: Dict<T.ControllerKey>;
  remapState?: T.RemapState;
}

const mapStateToProps = (state: T.EditorState): PropsFromState => {
  const c = selectedComponent(state.display);

  return {
    controllersById: controllersById(state.input),
    remapState: state.input.remap,
    ...(c && {
      componentId: c.id,
      inputMap: c.state.inputMap as Record<string, T.ControllerKey>,
    }),
  };
};

interface PropsFromDispatch {
  listenNextInput: (t: T.RemapState) => void;
}

interface BindingsFieldProps extends PropsFromState, PropsFromDispatch {
  bindings: T.ComponentBinding[];
}

const stringifyKeymap = (
  { inputKind, label }: T.ComponentBinding,
  controllerKeyString: string,
): string => `${label} (${inputKind}): ${controllerKeyString}`;

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators({ listenNextInput }, dispatch);

// TODO: disconnect this so that we don't have to render it when we
// don't need to
const BaseBindingsField: React.SFC<BindingsFieldProps> = ({
  bindings,
  componentId,
  controllersById,
  inputMap,
  listenNextInput,
  remapState,
}) =>
  !componentId ? (
    <div></div>
  ) : (
    <div>
      {console.log('b', bindings)}
      {bindings.map(binding => {
        const { inputKind, key: bindingKey } = binding;
        const controllerKey = inputMap && inputMap[bindingKey];
        const controllerId = controllerKey && controllerKey.controllerId;
        const key = controllerKey && controllerKey.key;

        const controllerKeyString = stringifyControllerKey(
          controllerId ? controllersById[controllerId] : undefined,
          key,
          remapState &&
            remapState.kind === 'component' &&
            remapState.componentId === componentId &&
            remapState.key === bindingKey,
        );

        return (
          <div key={bindingKey}>
            <button
              onClick={() =>
                listenNextInput({
                  kind: 'component',
                  componentId: componentId,
                  inputKind,
                  key: bindingKey,
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
  undefined,
  { areStatesEqual: () => false },
)(BaseBindingsField);
