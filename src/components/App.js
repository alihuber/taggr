const ipc = require('electron').ipcRenderer;
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { StickyContainer, Sticky } from 'react-sticky';
import last from 'lodash/last';
import { FilesProvider } from '../contexts/FilesContext';
import AppMenu from './AppMenu';
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
  constructor(props) {
    super(props);
    this.state = {
      filePaths: [],
      imagePath: '',
      setLoadedFiles: this.setLoadedFiles,
      setLoadedImage: this.setLoadedImage,
      filesLoaded: false,
      imageLoaded: false,
      filesMetadata: [],
      allSelected: false,
      setAllSelected: this.setAllSelected,
      setMetadata: this.setMetadata,
      moreThanOneSelected: false,
      oneSelected: false,
      setMoreThanOneSelected: this.setMoreThanOneSelected,
      setOneSelected: this.setOneSelected,
    };
  }

  _generateMetadata = fileData => {
    const metadata = [];
    if (fileData.presentMetadata.length !== 0) {
      fileData.presentMetadata.forEach(obj => {
        metadata.push(obj);
      });
      if (fileData.presentMetadata[0].cover.length !== 0) {
        this.setState({ imagePath: fileData.presentMetadata[0].cover, imageLoaded: true });
      }
    } else {
      fileData.paths.forEach(path => {
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
    }
    return metadata;
  };

  setLoadedFiles = fileData => {
    if (Object.entries(fileData).length !== 0) {
      const metadata = this._generateMetadata(fileData);
      this.setState({ filePaths: fileData.paths, filesLoaded: true, filesMetadata: metadata });
    } else {
      this.setState({ filePaths: [], filesLoaded: false, filesMetadata: [] });
    }
  };

  setLoadedImage = path => {
    if (path.length !== 0) {
      this.setState({ imagePath: path, imageLoaded: true });
      const currentMetadata = this.state.filesMetadata;
      currentMetadata.forEach((data, idx) => {
        data.cover = path;
      });
      this.setState({ filesMetadata: currentMetadata });
    } else {
      this.setState({ imagePath: '', imageLoaded: false, filesMetadata: [] });
    }
  };

  setMetadata = data => {
    this.setState({ filesMetadata: data });
  };

  setAllSelected = value => {
    this.setState({ allSelected: value });
  };

  setMoreThanOneSelected = value => {
    this.setState({ moreThanOneSelected: value });
  };

  setOneSelected = value => {
    this.setState({ oneSelected: value });
  };

  render() {
    const { classes } = this.props;

    ipc.on('selected-files', (event, fileData) => {
      this.setLoadedFiles(fileData);
    });

    ipc.on('selected-image', (event, paths) => {
      this.setLoadedImage(paths);
    });

    return (
      <MuiThemeProvider theme={theme}>
        <FilesProvider value={this.state}>
          <div className={classes.root}>
            <StickyContainer>
              <Sticky>{({ style }) => <AppMenu style={style} />}</Sticky>
              <Layout />
            </StickyContainer>
          </div>
        </FilesProvider>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
