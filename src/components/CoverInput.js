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

class CoverInput extends React.Component {
  render() {
    const { classes } = this.props;
    return 'Cover';
  }
}
export default CoverInput;
