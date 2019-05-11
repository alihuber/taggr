import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const NumberingDialog = ({ open, handleClose, filesContext }) => {
  const [storeLeadingZeros, setStoreLeadingZeros] = useState(false);
  const [storeTrackCount, setStoreTrackCount] = useState(false);

  const storeZeros = storeLeadingZeros;
  const storeTracks = storeTrackCount;

  const reset = () => {
    setStoreLeadingZeros(false);
    setStoreTrackCount(false);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={reset} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Numbering</DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={<Checkbox checked={storeZeros} onChange={() => setStoreLeadingZeros(!storeZeros)} value="StoreLeadingZeros" />}
          label="Store leading zeros"
        />
        <FormControlLabel
          control={<Checkbox checked={storeTracks} onChange={() => setStoreTrackCount(!storeTracks)} value="StoreTrackCount" />}
          label="Store track count"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(storeZeros, storeTracks, filesContext)} color="primary">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NumberingDialog;
