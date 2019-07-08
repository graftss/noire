import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as T from '../../types';
import { ComponentSelect } from './ComponentSelect';
import { ComponentBinding } from './ComponentBinding';
import { selectComponent } from '../../state/actions';
import { selectedComponentBinding } from '../../state/stateMaps';

interface PropsFromState {
  binding: T.Binding;
  selected: T.SerializedComponent;
  components: T.SerializedComponent[];
}

interface PropsFromDispatch {
  selectComponent: (componentId: string) => void;
}

type EditorProps = PropsFromState & PropsFromDispatch;

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  binding: selectedComponentBinding(state.display),
  selected: state.display.selectedComponent,
  components: state.display.components,
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators({ selectComponent }, dispatch);

const BaseEditor: React.SFC<EditorProps> = ({
  binding,
  components,
  selected,
  selectComponent,
}) => (
  <div>
    <ComponentSelect
      components={components}
      selected={selected}
      select={selectComponent}
    />
    <ComponentBinding binding={binding} />
  </div>
);

export const Editor = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseEditor);
