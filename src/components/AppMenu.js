import '../assets/css/App.css';
import React, { useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
  flex: {
    flexGrow: 1,
    cursor: 'pointer',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  grow: {
    flexGrow: 1,
  },
  title: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
    },
  },
});

const NumberingDialog = ({ open, handleClose }) => {
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
        <Button onClick={handleClose} color="primary">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

class AppMenu extends React.Component {
  state = {
    numberDialogOpen: false,
  };

  handleClickOpen = () => {
    this.setState({ numberDialogOpen: true });
  };

  handleClose = () => {
    this.setState({ numberDialogOpen: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <NumberingDialog open={this.state.numberDialogOpen} handleClose={this.handleClose} />
        <AppBar position="static">
          <Toolbar variant="dense">
            <Tooltip title="Save to disk">
              {/* TODO: disabled on global state */}
              <IconButton className={classes.menuButton} color="inherit" aria-label="Save" disabled>
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Numbering">
              {/* TODO: disabled on global state */}
              <IconButton className={classes.menuButton} color="inherit" aria-label="Numbering" onClick={this.handleClickOpen} disabled>
                <FormatListNumberedIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy from file names">
              {/* TODO: disabled on global state */}
              <IconButton className={classes.menuButton} color="inherit" aria-label="CopyFilenames" disabled>
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
            <div className={classes.grow} />
            <div className={classes.title}>
              <Typography variant="h6" color="inherit" className={classes.grow}>
                taggr
              </Typography>
            </div>
          </Toolbar>
        </AppBar>
      </>
    );
  }
}
export default withStyles(styles)(AppMenu);
