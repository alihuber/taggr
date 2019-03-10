import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

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
      <>
        <TextField id="standard-artist" label="Artist" placeholder="Artist" className={classes.textField} margin="normal" />
        <TextField
          id="standard-album-artist"
          label="Album Artist"
          placeholder="Album Artist"
          className={classes.textField}
          margin="normal"
        />
        <TextField id="standard-album" label="Album" placeholder="Album" className={classes.textField} margin="normal" />
        <TextField id="standard-genre" label="Genre" placeholder="Genre" className={classes.textField} margin="normal" />
        <TextField id="standard-year" label="Year" placeholder="Year" className={classes.textField} margin="normal" />
        <TextField id="standard-comment" label="Comment" placeholder="Comment" className={classes.textField} margin="normal" />
      </>
    );
  }
}

export default withStyles(styles)(AttributesInput);
