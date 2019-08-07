import * as React from 'react';
import { Snackbar } from '@material-ui/core';

interface PresentationSnackbarProps {
  close: () => void;
  isOpen: boolean;
}

export const PresentationSnackbar: React.SFC<PresentationSnackbarProps> = ({
  close,
  isOpen,
}) => (
  <div>
    <Snackbar
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      message="Press Esc to exit full screen"
      onClose={close}
      open={isOpen}
    />
  </div>
);
