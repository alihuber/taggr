const ipc = require('electron').ipcRenderer;
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
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

import {
  SET_FILENAME_DIALOG_OPEN,
  SET_NUMBERING_DIALOG_OPEN,
  SET_FILES_LOADED,
  SET_FILE_PATHS,
  SET_FILES_METADATA,
  CLEAR_DATA,
  CREATE_MESSAGE,
  SET_WORKING_METADATA,
} from '../actions/types';
import NumberingDialog from './NumberingDialog';
import FilenameCopyDialog from './FilenameCopyDialog';

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
      marginLeft: theme.spacing(),
      width: 'auto',
    },
  },
  statusIcon: {
    left: '-60px',
  },
});

const AppMenu = ({ classes, style }) => {
  const numberDialogOpen = useSelector(state => state.filenameDialogs.numberDialogOpen);
  const filenameCopyDialogOpen = useSelector(state => state.filenameDialogs.filenameCopyDialogOpen);
  const filePaths = useSelector(state => state.filesActions.filePaths);
  const workingMetadata = useSelector(state => state.inputActions.workingMetadata);
  const dispatch = useDispatch();
  const loadedStr = `Songs loaded: ${(filePaths && filePaths.length) || 0}`;

  const handleFilenameCopyClose = regExp => {
    if (workingMetadata && regExp) {
      try {
        workingMetadata.forEach((data, idx) => {
          const filename = data.fileName;
          data.title = filename.match(regExp)[1].trim();
        });
        dispatch({ type: SET_WORKING_METADATA, payload: workingMetadata });
      } catch (err) {
        console.log(err);
        dispatch({ type: CREATE_MESSAGE, payload: { errorMessage: 'Error setting filenames' } });
      }
    }
    dispatch({ type: SET_FILENAME_DIALOG_OPEN, payload: false });
  };

  const handleNumberingDialogClose = (storeZeros = false, storeTracks = false) => {
    if (workingMetadata) {
      workingMetadata.forEach((data, idx) => {
        if (data.selected) {
          let trackNum = String(idx + 1);
          let trackCount = String(workingMetadata.length);
          let maxLength = String(workingMetadata.length).length;
          if (maxLength === 1) {
            maxLength = 2;
          }
          if (storeZeros && storeTracks) {
            trackNum = trackNum.padStart(maxLength, '0');
            if (workingMetadata.length < 10) {
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
      dispatch({ type: SET_WORKING_METADATA, payload: workingMetadata });
    }
    dispatch({ type: SET_NUMBERING_DIALOG_OPEN, payload: false });
  };

  const handleSave = () => {
    ipc.send('save-metadata', filePaths, workingMetadata);
  };

  const handleClear = () => {
    ipc.send('clear-data');
    dispatch({ type: SET_FILE_PATHS, payload: [] });
    dispatch({ type: SET_FILES_LOADED, payload: false });
    dispatch({ type: SET_FILES_METADATA, payload: [] });
    dispatch({ type: CLEAR_DATA, payload: true });
    // filesContext.setLoadedImage('');
  };

  return (
    <>
      <NumberingDialog open={numberDialogOpen} handleClose={handleNumberingDialogClose} />
      <FilenameCopyDialog open={filenameCopyDialogOpen} handleClose={handleFilenameCopyClose} />
      <AppBar position="static" style={style}>
        <Toolbar variant="dense">
          <Tooltip title="Save to disk">
            <IconButton className={classes.menuButton} color="inherit" aria-label="Save" onClick={handleSave}>
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Numbering">
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Numbering"
              onClick={() => dispatch({ type: SET_NUMBERING_DIALOG_OPEN, payload: true })}
            >
              <FormatListNumberedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Set title from file name">
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="CopyFilenames"
              onClick={() => dispatch({ type: SET_FILENAME_DIALOG_OPEN, payload: true })}
            >
              <FileCopyIcon />
            </IconButton>
          </Tooltip>
          <div className={classes.grow} />
          {<BottomNavigationAction className={classes.statusIcon} label={loadedStr} icon={<MusicNoteIcon />} disabled showLabel />}
          {
            <BottomNavigationAction
              className={classes.statusIcon}
              label="Clear"
              icon={<ClearIcon />}
              showLabel
              value={2}
              onClick={() => handleClear()}
            />
          }
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
};

AppMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AppMenu);
