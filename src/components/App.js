const ipc = require('electron').ipcRenderer;
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import last from 'lodash/last';
import { FilesProvider } from '../contexts/FilesContext';
import AppMenu from './AppMenu';
import StatusBar from './StatusBar';
import Layout from './Layout';
import '../assets/css/App.css';

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

class App extends React.Component {
  state = {
    filePaths: [],
    setLoadedFiles: this.setLoadedFiles,
    filesLoaded: false,
    filesMetadata: [],
  };

  _generateMetadata = paths => {
    const metadata = [];
    paths.forEach(path => {
      const fileName = last(path.split('/'));
      const obj = {
        numbering: '',
        title: '',
        artist: '',
        fileName,
        albumArtist: '',
        album: '',
        genre: '',
        year: '',
        comment: '',
        cover: '',
        selected: false,
      };
      metadata.push(obj);
    });
    return metadata;
  };

  setLoadedFiles = paths => {
    const metadata = this._generateMetadata(paths);
    this.setState({ filePaths: [...paths], filesLoaded: true, filesMetadata: metadata });
  };

  render() {
    const { classes } = this.props;

    ipc.on('selected-files', (event, paths) => {
      this.setLoadedFiles(paths);
    });

    return (
      <MuiThemeProvider theme={theme}>
        <FilesProvider value={this.state}>
          <div className={classes.root}>
            <AppMenu />
            <Layout />
            <StatusBar />
          </div>
        </FilesProvider>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
