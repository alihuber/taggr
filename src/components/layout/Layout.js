const ipc = require('electron').ipcRenderer;
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Sticky } from 'react-sticky';
import AttributesSegment from '../AttributesSegment';
import SongsTable from '../SongsTable';
// import CoverInput from './CoverInput';

const styles = theme => ({
  divider: {
    marginTop: 17,
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: 'rgba(128, 128, 128, 0.3)',
  },
  textContent: {
    marginTop: 300,
    opacity: 0.5,
  },
  button: {
    margin: theme.spacing(),
  },
});

const sendOpenFileDialog = () => {
  ipc.send('open-file-dialog-for-files');
};

const Layout = ({ classes }) => {
  const filesLoaded = useSelector(state => state.filesActions.filesLoaded);

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     titleValue: '',
  //     artistValue: '',
  //     albumArtistValue: '',
  //     albumValue: '',
  //     genreValue: '',
  //     yearValue: '',
  //     commentValue: '',
  //     setFieldValue: this.setFieldValue,
  //     getFieldValue: this.getFieldValue,
  //   };
  // }

  // setFieldValue = (fieldName, value) => {
  //   this.setState({ [`${fieldName}Value`]: value });
  // };

  // getFieldValue = fieldName => {
  //   return this.state[`${fieldName}Value`];
  // };

  return (
    <Grid fluid>
      <Row center="xs">
        <Col xs={3} sm={3} md={3} lg={3} className={classes.divider}>
          <Sticky>{({ style }) => <AttributesSegment style={style} />}</Sticky>
          <Sticky>{({ style }) => <p style={style}>test2</p>}</Sticky>
        </Col>
        <Col xs={9} sm={9} md={9} lg={9}>
          {filesLoaded ? (
            <SongsTable />
          ) : (
            <div className={classes.textContent}>
              <Button variant="outlined" color="inherit" className={classes.button} onClick={sendOpenFileDialog}>
                <Typography variant="subtitle1">No files loaded. Click here to open...</Typography>
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Grid>
  );
};

export default withStyles(styles)(Layout);
