import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing(),
    marginRight: theme.spacing(),
    width: 350,
  },
  startAdornment: {
    width: 200,
  },
});

const FilenameCopyDialog = ({ open, handleClose, classes }) => {
  const [regexp, setRegExp] = useState('\\d\\d - (.*).mp3');

  const reset = () => {
    handleClose();
  };

  const handleChange = event => {
    setRegExp(event.target.value);
  };

  return (
    <Dialog open={open} onClose={reset} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Copy title from file name</DialogTitle>
      <DialogContent>
        <TextField
          id="standard-name"
          label="RegExp"
          className={classes.textField}
          value={regexp}
          onChange={handleChange}
          margin="normal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" className={classes.startAdornment}>
                RegExp:
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(regexp)} color="primary">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

FilenameCopyDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleFilenameCopyClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(FilenameCopyDialog);
