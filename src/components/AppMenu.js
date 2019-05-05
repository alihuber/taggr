import '../assets/css/App.css';
const ipc = require('electron').ipcRenderer;
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
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import ClearIcon from '@material-ui/icons/Clear';
import { FilesConsumer } from '../contexts/FilesContext';

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
  statusIcon: {
    left: '-60px',
  },
});

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

class AppMenu extends React.Component {
  state = {
    numberDialogOpen: false,
  };

  handleNumberClickOpen = () => {
    this.setState({ numberDialogOpen: true });
  };

  handleCopyFilenames = filesContext => {
    const { filesMetadata } = filesContext;
    filesMetadata.forEach((data, idx) => {
      // TODO: error message on non-parseable files
      data.title = data.fileName
        .split('-')[1]
        .split('.mp3')[0]
        .trim();
    });
    filesContext.setMetadata(filesMetadata);
  };

  handleNumberClose = (storeZeros = false, storeTracks = false, filesContext = {}) => {
    const { filesMetadata } = filesContext;
    if (filesMetadata) {
      filesMetadata.forEach((data, idx) => {
        if (data.selected) {
          let numbering = String(idx + 1);
          if (storeZeros) {
            // TODO: also pad numbers when length < 10
            const maxLength = String(filesMetadata.length).length;
            numbering = numbering.padStart(maxLength, '0');
          }
          if (storeTracks) {
            numbering += `/${filesMetadata.length}`;
          }
          data.numbering = numbering;
        }
      });
      filesContext.setMetadata(filesMetadata);
    }
    this.setState({ numberDialogOpen: false });
  };

  handleSave = filesContext => {
    ipc.send('save-metadata', filesContext);
  };

  handleClear = filesContext => {
    ipc.send('clear-data');
    filesContext.setLoadedFiles([]);
    filesContext.setLoadedImage('');
    filesContext.setAllSelected(false);
    filesContext.setMetadata([]);
    filesContext.setMoreThanOneSelected(false);
    filesContext.setOneSelected(false);
  };

  render() {
    const { classes, style } = this.props;
    return (
      <AppBar position="static" style={style}>
        <FilesConsumer>
          {filesContext => {
            // TODO: better status strings, files selected/saved, errors etc.
            const loadedStr = `Files loaded: ${filesContext.filePaths.length}`;
            return (
              <>
                <Toolbar variant="dense">
                  <Tooltip title="Save to disk">
                    <IconButton
                      className={classes.menuButton}
                      color="inherit"
                      aria-label="Save"
                      disabled={!filesContext.filesLoaded}
                      onClick={() => this.handleSave(filesContext)}
                    >
                      <SaveIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Numbering">
                    <IconButton
                      className={classes.menuButton}
                      color="inherit"
                      aria-label="Numbering"
                      onClick={this.handleNumberClickOpen}
                      disabled={!filesContext.filesLoaded || !filesContext.oneSelected}
                    >
                      <FormatListNumberedIcon />
                    </IconButton>
                  </Tooltip>
                  {/* TODO: make filename schema editable */}
                  <Tooltip title="Set title from file name">
                    <IconButton
                      className={classes.menuButton}
                      color="inherit"
                      aria-label="CopyFilenames"
                      onClick={() => this.handleCopyFilenames(filesContext)}
                      disabled={!filesContext.filesLoaded || !filesContext.oneSelected}
                    >
                      <FileCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <div className={classes.grow} />
                  {/* TODO: switch theme */}
                  {<BottomNavigationAction className={classes.statusIcon} label={loadedStr} icon={<MusicNoteIcon />} disabled showLabel />}
                  {
                    <BottomNavigationAction
                      className={classes.statusIcon}
                      label="Clear"
                      icon={<ClearIcon />}
                      showLabel
                      onClick={() => this.handleClear(filesContext)}
                    />
                  }
                  <div className={classes.grow} />
                  <div className={classes.title}>
                    <Typography variant="h6" color="inherit" className={classes.grow}>
                      taggr
                    </Typography>
                  </div>
                </Toolbar>
                <NumberingDialog open={this.state.numberDialogOpen} handleClose={this.handleNumberClose} filesContext={filesContext} />
              </>
            );
          }}
        </FilesConsumer>
      </AppBar>
    );
  }
}
export default withStyles(styles)(AppMenu);
