const ipc = require('electron').ipcRenderer;
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { StickyContainer, Sticky } from 'react-sticky';
import last from 'lodash/last';
import { FilesProvider } from '../contexts/FilesContext';
import AppMenu from './AppMenu';
import Layout from './Layout';
import '../index.css';
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
      setLoadedFiles: this.setLoadedFiles,
      filesLoaded: false,
      filesMetadata: [],
      allSelected: false,
      setAllSelected: this.setAllSelected,
      setMetadata: this.setMetadata,
      moreThanOneSelected: false,
      oneSelected: false,
    };
  }

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

  setMetadata = data => {
    let numSelected = 0;
    data.forEach(m => (m.selected ? (numSelected += 1) : null));
    this.setState({ filesMetadata: data });
    if (numSelected > 1) {
      this.setState({ moreThanOneSelected: true });
    } else {
      this.setState({ moreThanOneSelected: false });
    }
    if (numSelected === 1) {
      this.setState({ oneSelected: true });
    }
    if (numSelected === 0) {
      this.setState({ oneSelected: false });
    }
  };

  setAllSelected = value => {
    this.setState({ allSelected: value });
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
