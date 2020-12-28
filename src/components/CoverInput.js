const ipc = require('electron').ipcRenderer;
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import cloneDeep from 'lodash/cloneDeep';
import { SET_WORKING_METADATA } from '../actions/types';

const styles = theme => ({
  textField: {
    width: '100%',
  },
  card: {
    marginTop: 20,
    minHeight: 200,
  },
  cardContent: {
    textAlign: 'center',
    paddingTop: 70,
    opacity: 0.5,
    width: '200px',
  },
});

const sendOpenFileDialog = () => {
  ipc.send('open-file-dialog-for-image');
};

const allEqual = arr => arr.every(v => v === arr[0]);
const allNull = arr => {
  let flag = true;
  arr.forEach(v => {
    if (v.length !== 0) {
      flag = false;
    }
  });
  return flag;
};

const CoverCard = props => {
  const oldStyle = cloneDeep(props.style);
  const dispatch = useDispatch();
  let newStyle = Object.assign(oldStyle, { position: 'fixed', top: 560 });
  const workingMetadata = useSelector(state => state.inputActions.workingMetadata);
  const inputActions = useSelector(state => state.inputActions);
  const filesLoaded = useSelector(state => state.filesActions.filesLoaded);

  const removeImage = () => {
    workingMetadata.forEach(data => {
      if (data.selected) {
        data.cover = '';
      }
    });
    dispatch({ type: SET_WORKING_METADATA, payload: workingMetadata });
  };

  if (inputActions.oneSelected && !inputActions.moreThanOneSelected) {
    const selectedSong = workingMetadata.find(m => m.selected);
    if (selectedSong && selectedSong.cover && selectedSong.cover.length !== 0) {
      return (
        <div style={newStyle}>
          <img src={`data:image/jpeg;base64,${selectedSong.cover}`} width={230} height={200} />
          <br />
          <Button variant="outlined" size="small" color="inherit" className={props.classes.button} onClick={() => removeImage()}>
            Remove image
          </Button>
        </div>
      );
    } else {
      return (
        <div style={newStyle}>
          <Card className={props.classes.card}>
            <CardContent className={props.classes.cardContent}>
              <Button variant="outlined" color="inherit" className={props.classes.button} onClick={sendOpenFileDialog}>
                <Typography variant="subtitle1">Click here to open an image</Typography>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  } else if (inputActions.moreThanOneSelected || inputActions.allSelected) {
    // if in selected songs are images set:
    //   if it is the same image, display that
    //   if it is not the same image or no image: display "multiple" hint and upload button
    // if there are no images: display upload button
    const collectedFields = [];
    workingMetadata.forEach(data => {
      if (data.selected) {
        collectedFields.push(data.cover);
      }
    });
    if (collectedFields.length !== 0) {
      if (allEqual(collectedFields) && !allNull(collectedFields)) {
        const firstCover = workingMetadata.find(m => m.cover.length !== 0).cover;
        return (
          <div style={newStyle}>
            <img src={`data:image/jpeg;base64,${firstCover}`} width={230} height={200} />
            <br />
            <Button variant="outlined" size="small" color="inherit" className={props.classes.button} onClick={() => removeImage()}>
              Remove image
            </Button>
          </div>
        );
      } else if (allNull(collectedFields)) {
        return (
          <div style={newStyle}>
            <Card className={props.classes.card}>
              <CardContent className={props.classes.cardContent}>
                <Button variant="outlined" color="inherit" className={props.classes.button} onClick={sendOpenFileDialog}>
                  <Typography variant="subtitle1">Click here to open an image</Typography>
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      } else {
        return (
          <div style={newStyle}>
            <Card className={props.classes.card}>
              <CardContent className={props.classes.cardContent}>
                <Button variant="outlined" color="inherit" className={props.classes.button} onClick={sendOpenFileDialog}>
                  <Typography variant="subtitle1">Multiple Images set. Click here to open an image</Typography>
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      }
    } else {
      return (
        <div style={newStyle}>
          <Card className={props.classes.card}>
            <CardContent className={props.classes.cardContent}>
              <Button variant="outlined" color="inherit" className={props.classes.button} onClick={sendOpenFileDialog}>
                <Typography variant="subtitle1">Click here to open an image</Typography>
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  } else {
    return (
      <div style={newStyle}>
        <Card className={props.classes.card}>
          <CardContent className={props.classes.cardContent}>
            <Button
              disabled={!filesLoaded || !inputActions.oneSelected || !inputActions.moreThanOneSelected || !inputActions.allSelected}
              variant="outlined"
              color="inherit"
              className={props.classes.button}
              onClick={sendOpenFileDialog}
            >
              <Typography variant="subtitle1">Click here to open an image</Typography>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
};

const CoverInput = ({ classes, style }) => {
  const workingMetadata = useSelector(state => state.inputActions.workingMetadata);
  const inputActions = useSelector(state => state.inputActions);
  const dispatch = useDispatch();
  const selectedIds = inputActions.selectedIds;

  ipc.on('selected-image', (event, data) => {
    workingMetadata.forEach(m => {
      if (selectedIds.lenght !== 0 && selectedIds.includes(m._id)) {
        m.cover = data;
      }
    });
    dispatch({ type: SET_WORKING_METADATA, payload: workingMetadata });
  });
  return <CoverCard classes={classes} style={style} />;
};
export default withStyles(styles)(CoverInput);
