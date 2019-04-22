import React, { useCallback } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Row, Col } from 'react-flexbox-grid';
import AttributesInput from './AttributesInput';
import SongsTable from './SongsTable';
import { useDropzone } from 'react-dropzone';
import CoverInput from './CoverInput';
import Typography from '@material-ui/core/Typography';
import { FilesConsumer } from '../contexts/FilesContext';

const styles = {
  divider: {
    marginTop: 17,
    borderRightWidth: 1,
    borderRightStyle: 'solid',
    borderRightColor: 'rgba(128, 128, 128, 0.3)',
  },
  textContent: {
    marginTop: 300,
    opacity: 0.5,
  },
};

const SongsDropzone = props => {
  const onDrop = useCallback(acceptedFiles => {
    const reader = new FileReader();

    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;
      console.log(binaryStr);
    };

    acceptedFiles.forEach(file => reader.readAsBinaryString(file));
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div className={props.classes.textContent}>
        <Typography variant="subtitle1">No songs loaded. Drag songs or click here to open...</Typography>
      </div>
    </div>
  );
};

class Layout extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Grid fluid>
        <Row center="xs">
          <Col xs={3} sm={3} md={3} lg={3} className={classes.divider}>
            <AttributesInput />
            <CoverInput />
          </Col>
          <Col xs={9} sm={9} md={9} lg={9}>
            <SongsDropzone classes={classes} />
            <FilesConsumer>{context => (context.filesLoaded ? <SongsTable /> : null)}</FilesConsumer>
          </Col>
        </Row>
      </Grid>
    );
  }
}

export default withStyles(styles)(Layout);
