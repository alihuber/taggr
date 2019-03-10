import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MusicNoteIcon from '@material-ui/icons/MusicNote';

const styles = {
  root: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
};

class StatusBar extends React.Component {
  state = {
    songsLoaded: 0,
  };

  render() {
    const { classes } = this.props;
    const { songsLoaded } = this.state;
    const loadedNum = `Songs loaded: ${songsLoaded}`;
    return (
      <BottomNavigation showLabels className={classes.root}>
        <BottomNavigationAction label={loadedNum} icon={<MusicNoteIcon />} />
      </BottomNavigation>
    );
  }
}

export default withStyles(styles)(StatusBar);
