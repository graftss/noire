import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

const BaseComponentFields = () => (<div></div>);

export const ComponentFields = connect(mapStateToProps, mapDispatchToProps)(BaseComponentFields);
