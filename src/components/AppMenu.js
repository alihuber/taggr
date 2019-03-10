import '../assets/css/App.css';
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
});

class AppMenu extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <AppBar position="static">
        <Toolbar variant="dense">
          <Tooltip title="Save to disk">
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Numbering">
            <IconButton className={classes.menuButton} color="inherit" aria-label="Format">
              <FormatListNumberedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy from file name">
            <IconButton className={classes.menuButton} color="inherit" aria-label="Copy">
              <FileCopyIcon />
            </IconButton>
          </Tooltip>
          <div className={classes.grow} />
          <div className={classes.title}>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              taggr
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}
export default withStyles(styles)(AppMenu);
