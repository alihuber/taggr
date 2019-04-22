import '../assets/css/App.css';
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { FilesProvider } from '../contexts/FilesContext';
import AppMenu from './AppMenu';
import StatusBar from './StatusBar';
import Layout from './Layout';

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
  };

  setLoadedFiles = paths => {
    this.setState({ filePaths: [...paths], filesLoaded: true });
  };

  render() {
    const { classes } = this.props;
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
