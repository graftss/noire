import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as T from '../../types';
import { ComponentSelect } from './ComponentSelect';
import { ComponentBinding } from './ComponentBinding';
import { selectedComponentBinding } from '../../state/stateMaps';

interface PropsFromState {
  binding: T.BindingData;
}

interface PropsFromDispatch {

}

interface EditorProps extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = (state: T.EditorState) => ({
  binding: selectedComponentBinding(state.display),
});

const BaseEditor: React.SFC<EditorProps> = ({ binding }) => (
  <div>
    <ComponentSelect />
    <ComponentBinding binding={binding}/>
  </div>
)

export const Editor = connect(mapStateToProps)(BaseEditor);
