import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FilesConsumer } from '../contexts/FilesContext';

const styles = theme => ({
  textField: {
    // marginLeft: theme.spacing.unit,
    // marginRight: theme.spacing.unit,
    width: '100%',
  },
});

class AttributesInput extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <FilesConsumer>
        {context => (
          <>
            <TextField
              id="standard-artist"
              label="Artist"
              placeholder="Artist"
              className={classes.textField}
              margin="normal"
              disabled={!context.filesLoaded}
            />
            <TextField
              id="standard-album-artist"
              label="Album Artist"
              placeholder="Album Artist"
              className={classes.textField}
              margin="normal"
              disabled={!context.filesLoaded}
            />
            <TextField
              id="standard-album"
              label="Album"
              placeholder="Album"
              className={classes.textField}
              margin="normal"
              disabled={!context.filesLoaded}
            />
            <TextField
              id="standard-genre"
              label="Genre"
              placeholder="Genre"
              className={classes.textField}
              margin="normal"
              disabled={!context.filesLoaded}
            />
            <TextField
              id="standard-year"
              label="Year"
              placeholder="Year"
              className={classes.textField}
              margin="normal"
              disabled={!context.filesLoaded}
            />
            <TextField
              id="standard-comment"
              label="Comment"
              placeholder="Comment"
              className={classes.textField}
              margin="normal"
              disabled={!context.filesLoaded}
            />
          </>
        )}
      </FilesConsumer>
    );
  }
}

export default withStyles(styles)(AttributesInput);
