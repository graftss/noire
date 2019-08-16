import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import * as events from '../../../display/events';
import * as actions from '../../../state/actions';
import * as selectors from '../../../state/selectors';
import { BooleanField } from './BooleanField';

interface PropsFromState {
  visibility: boolean;
  target: Maybe<T.KonvaSelectable>;
}

interface PropsFromDispatch {
  emitDisplayEvents: (e: T.DisplayEvent[]) => void;
  toggleKonvaTransformer: () => void;
}

interface TransformerToggleProps extends PropsFromState, PropsFromDispatch {}

const mapStateToProps = (state: T.EditorState): PropsFromState => ({
  visibility: selectors.transformerVisibility(state),
  target: selectors.transformerTarget(state),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    {
      emitDisplayEvents: actions.emitDisplayEvents,
      toggleKonvaTransformer: actions.toggleKonvaTransformer,
    },
    dispatch,
  );

const BaseTransformerToggle: React.SFC<TransformerToggleProps> = ({
  emitDisplayEvents,
  target,
  toggleKonvaTransformer,
  visibility,
}) => (
  <BooleanField
    defaultValue={visibility}
    initialValue={visibility}
    update={() => {
      if (!target) return;
      toggleKonvaTransformer();
      emitDisplayEvents([events.setTransformerVisibility(!visibility)]);
    }}
  />
);

export const TransformerToggle = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseTransformerToggle);
