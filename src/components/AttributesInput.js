import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { FilesConsumer } from '../contexts/FilesContext';
import cloneDeep from 'lodash/cloneDeep';

const styles = theme => ({
  textField: {
    width: '100%',
  },
});

class AttributesInput extends React.Component {
  render() {
    const { classes, style } = this.props;
    const oldStyle = cloneDeep(style);
    let newStyle = Object.assign(oldStyle, { top: 55 });
    return (
      <FilesConsumer>
        {context => (
          <div style={newStyle}>
            <TextField
              id="standard-title"
              label="Title"
              placeholder="Title"
              className={classes.textField}
              margin="normal"
              disabled={!context.filesLoaded || !context.oneSelected || context.allSelected || context.moreThanOneSelected}
            />
            <TextField
              id="standard-artist"
              label="Artist"
              placeholder="Artist"
              className={classes.textField}
              margin="normal"
              disabled={!context.filesLoaded || !context.oneSelected}
            />
            <TextField
              id="standard-album-artist"
              label="Album Artist"
              placeholder="Album Artist"
              className={classes.textField}
              margin="normal"
              disabled={!context.filesLoaded || !context.oneSelected}
            />
            <TextField
              id="standard-album"
              label="Album"
              placeholder="Album"
              className={classes.textField}
              margin="normal"
              disabled={!context.filesLoaded || !context.oneSelected}
            />
            <TextField
              id="standard-genre"
              label="Genre"
              placeholder="Genre"
              className={classes.textField}
              margin="normal"
              disabled={!context.filesLoaded || !context.oneSelected}
            />
            <TextField
              id="standard-year"
              label="Year"
              placeholder="Year"
              className={classes.textField}
              margin="normal"
              disabled={!context.filesLoaded || !context.oneSelected}
            />
            <TextField
              id="standard-comment"
              label="Comment"
              placeholder="Comment"
              className={classes.textField}
              margin="normal"
              disabled={!context.filesLoaded || !context.oneSelected}
            />
          </div>
        )}
      </FilesConsumer>
    );
  }
}

export default withStyles(styles)(AttributesInput);
