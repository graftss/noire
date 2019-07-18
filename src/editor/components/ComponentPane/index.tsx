import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectedComponent } from '../../../state/selectors';
import { updateComponentName } from '../../../state/actions';
import * as T from '../../../types';
import { ComponentName } from './ComponentName';

interface PropsFromState {
  selected: Maybe<T.SerializedComponent>;
}

interface PropsFromDispatch {
  updateComponentName: (id: string, name: string) => void;
}

interface ComponentPaneProps extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = (state): PropsFromState => ({
  selected: selectedComponent(state.display),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators({ updateComponentName }, dispatch);

const BaseComponentPane: React.SFC<ComponentPaneProps> = ({
  selected,
  updateComponentName,
}) =>
  selected ? (
    <div>
      hello
      <ComponentName
        initialName={selected.name}
        save={name => updateComponentName(selected.id, name)}
      />
    </div>
  ) : null;

export const ComponentPane = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseComponentPane);
