import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  textField: {
    width: '100%',
  },
  card: {
    marginTop: 40,
    minHeight: 150,
  },
  cardContent: {
    textAlign: 'center',
    paddingTop: 50,
  },
});

const MyDropzone = props => {
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
      <Card className={props.classes.card}>
        <CardContent className={props.classes.cardContent}>
          <Typography>Drag 'n' drop an image here, or click to select a file</Typography>
        </CardContent>
      </Card>
    </div>
  );
};

class CoverInput extends React.Component {
  render() {
    const { classes } = this.props;
    return <MyDropzone classes={classes} />;
  }
}
export default withStyles(styles)(CoverInput);
