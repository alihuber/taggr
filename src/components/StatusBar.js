import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import { FilesConsumer } from '../contexts/FilesContext';

const styles = {
  root: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
};

const StatusBar = props => {
  const { classes } = props;
  return (
    <BottomNavigation showLabels className={classes.root}>
      <FilesConsumer>
        {context => {
          const loadedStr = `Songs loaded: ${context.filePaths.length}`;
          return <BottomNavigationAction label={loadedStr} icon={<MusicNoteIcon />} disabled showLabel />;
        }}
      </FilesConsumer>
    </BottomNavigation>
  );
};

export default withStyles(styles)(StatusBar);
