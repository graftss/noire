import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as T from '../../../types';
import {
  emitDisplayEvents,
  toggleKonvaTransformer,
} from '../../../state/actions';
import {
  transformerTarget,
  transformerVisibility,
} from '../../../state/selectors';
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
  visibility: transformerVisibility(state),
  target: transformerTarget(state),
});

const mapDispatchToProps = (dispatch): PropsFromDispatch =>
  bindActionCreators(
    {
      emitDisplayEvents,
      toggleKonvaTransformer,
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
    initialValue={visibility}
    update={() => {
      if (!target) return;

      toggleKonvaTransformer();
      emitDisplayEvents([
        {
          kind: 'setKonvaTransformerVisibility',
          data: !visibility,
        },
      ]);
    }}
  />
);

export const TransformerToggle = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BaseTransformerToggle);
