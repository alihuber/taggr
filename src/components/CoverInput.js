const ipc = require('electron').ipcRenderer;
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import cloneDeep from 'lodash/cloneDeep';
import { FilesConsumer } from '../contexts/FilesContext';

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
  },
});

const sendOpenFileDialog = () => {
  ipc.send('open-file-dialog-for-image');
};

const removeImage = context => {
  ipc.send('clear-data');
  context.setLoadedImage('', true);
};

const CoverCard = props => {
  const oldStyle = cloneDeep(props.style);
  let newStyle = Object.assign(oldStyle, { position: 'fixed', top: 580 });
  return (
    <FilesConsumer>
      {context => (
        <>
          {context.imageLoaded ? (
            <div style={newStyle}>
              <img src="http://localhost:3000/cover.jpg" width={230} height={200} />
              <Button variant="outlined" size="small" color="inherit" className={props.classes.button} onClick={() => removeImage(context)}>
                Remove image
              </Button>
            </div>
          ) : (
            <div style={newStyle}>
              <Card className={props.classes.card}>
                <CardContent className={props.classes.cardContent}>
                  <Button
                    disabled={!context.filesLoaded}
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
          )}
        </>
      )}
    </FilesConsumer>
  );
};

class CoverInput extends React.Component {
  render() {
    const { classes, style } = this.props;
    return <CoverCard classes={classes} style={style} />;
  }
}
export default withStyles(styles)(CoverInput);
