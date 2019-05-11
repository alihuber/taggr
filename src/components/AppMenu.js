import '../assets/css/App.css';
const ipc = require('electron').ipcRenderer;
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import Tooltip from '@material-ui/core/Tooltip';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import ClearIcon from '@material-ui/icons/Clear';

import { FilesConsumer } from '../contexts/FilesContext';
import NumberingDialog from './NumberingDialog';

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

  handleNumberingDialogClose = (storeZeros = false, storeTracks = false, filesContext = {}) => {
    const { filesMetadata } = filesContext;
    if (filesMetadata) {
      filesMetadata.forEach((data, idx) => {
        if (data.selected) {
          let trackNum = String(idx + 1);
          let trackCount = String(filesMetadata.length);
          let maxLength = String(filesMetadata.length).length;
          if (maxLength === 1) {
            maxLength = 2;
          }
          if (storeZeros && storeTracks) {
            trackNum = trackNum.padStart(maxLength, '0');
            if (filesMetadata.length < 10) {
              trackCount = trackCount.padStart(2, '0');
            }
            data.numbering = `${trackNum}/${trackCount}`;
          }
          if (storeZeros && !storeTracks) {
            trackNum = trackNum.padStart(maxLength, '0');
            data.numbering = trackNum;
          }
          if (!storeZeros && storeTracks) {
            data.numbering = `${trackNum}/${trackCount}`;
          }
          if (!storeZeros && !storeTracks) {
            data.numbering = trackNum;
          }
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
                      value={2}
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
                <NumberingDialog
                  open={this.state.numberDialogOpen}
                  handleClose={this.handleNumberingDialogClose}
                  filesContext={filesContext}
                />
              </>
            );
          }}
        </FilesConsumer>
      </AppBar>
    );
  }
}

export default withStyles(styles)(AppMenu);
