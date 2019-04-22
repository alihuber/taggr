const ipc = require('electron').ipcRenderer;
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AttributesInput from './AttributesInput';
import SongsTable from './SongsTable';
import CoverInput from './CoverInput';
import { FilesConsumer } from '../contexts/FilesContext';

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
    margin: theme.spacing.unit,
  },
});

const sendOpenFileDialog = () => {
  ipc.send('open-file-dialog-for-files');
};

class Layout extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Grid fluid>
        <Row center="xs">
          <Col xs={3} sm={3} md={3} lg={3} className={classes.divider}>
            <AttributesInput />
            <CoverInput />
          </Col>
          <Col xs={9} sm={9} md={9} lg={9}>
            <FilesConsumer>
              {context => (
                <>
                  {context.filesLoaded ? (
                    <SongsTable />
                  ) : (
                    <div className={classes.textContent}>
                      <Button variant="outlined" color="inherit" className={classes.button} onClick={sendOpenFileDialog}>
                        <Typography variant="subtitle1">No songs loaded. Click here to open...</Typography>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </FilesConsumer>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withStyles(styles)(Layout);
