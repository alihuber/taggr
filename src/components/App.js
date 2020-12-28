const ipc = require('electron').ipcRenderer;
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { StickyContainer, Sticky } from 'react-sticky';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import Alerts from './layout/Alerts';
import Layout from './layout/Layout';
import AppMenu from './AppMenu';
import '../index.css';
import { SET_FILES_LOADED, SET_FILE_PATHS, SET_WORKING_METADATA } from '../actions/types';

const alertOptions = {
  timeout: 2000,
  position: 'bottom center',
};

const styles = {
  root: {
    flexGrow: 1,
  },
};

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#8bf6ff',
      main: '#4fc3f7',
      dark: '#0093c4',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#5b36e2',
      main: '#0000af',
      dark: '#00007e',
      contrastText: '#ffffff',
    },
  },
});

const App = ({ classes }) => {
  const dispatch = useDispatch();
  ipc.on('selected-files', (event, fileData) => {
    dispatch({ type: SET_FILE_PATHS, payload: fileData.paths });
    dispatch({ type: SET_WORKING_METADATA, payload: fileData.presentMetadata });
    dispatch({ type: SET_FILES_LOADED, payload: true });
  });

  return (
    <AlertProvider template={AlertTemplate} {...alertOptions}>
      <MuiThemeProvider theme={theme}>
        <Alerts />
        <div className={classes.root}>
          <StickyContainer>
            <Sticky>{({ style }) => <AppMenu style={style} />}</Sticky>
            <Layout />
          </StickyContainer>
        </div>
      </MuiThemeProvider>
    </AlertProvider>
  );
};

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
