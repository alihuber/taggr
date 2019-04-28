import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import first from 'lodash/first';
import { FilesConsumer } from '../contexts/FilesContext';
import { AttributesConsumer } from '../contexts/AttributesContext';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: '100%',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});

class SongsTableHead extends React.Component {
  render() {
    const { onSelectAllClick, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          <TableCell>#</TableCell>
          <TableCell>Title</TableCell>
          <TableCell>Artist</TableCell>
          <TableCell>File Name</TableCell>
        </TableRow>
      </TableHead>
    );
  }
}

class SongsTable extends React.Component {
  handleSelectAllClick = (event, filesContext, attributesContext) => {
    const value = event.target.checked;
    filesContext.filesMetadata.forEach(metadata => {
      metadata.selected = value;
    });
    if (value) {
      attributesContext.setFieldValue('artist', '');
      attributesContext.setFieldValue('albumArtist', '');
      attributesContext.setFieldValue('album', '');
      attributesContext.setFieldValue('genre', '');
      attributesContext.setFieldValue('year', '');
      attributesContext.setFieldValue('comment', '');
      filesContext.setMoreThanOneSelected(true);
      filesContext.setOneSelected(true);
      filesContext.setAllSelected(true);
    } else {
      filesContext.setMoreThanOneSelected(false);
      filesContext.setOneSelected(false);
      filesContext.setAllSelected(false);
    }
    filesContext.setMetadata(filesContext.filesMetadata);
  };

  handleClick = (evt, idx, filesContext, attributesContext) => {
    const { filesMetadata } = filesContext;
    const value = filesMetadata[idx].selected;
    filesMetadata[idx].selected = !value;
    let numSelected = 0;
    filesMetadata.forEach(m => (m.selected ? (numSelected += 1) : null));
    if (numSelected > 1) {
      filesContext.setMoreThanOneSelected(true);
      filesContext.setOneSelected(true);
      attributesContext.setFieldValue('artist', '');
      attributesContext.setFieldValue('albumArtist', '');
      attributesContext.setFieldValue('album', '');
      attributesContext.setFieldValue('genre', '');
      attributesContext.setFieldValue('year', '');
      attributesContext.setFieldValue('comment', '');
    } else if (numSelected < 1) {
      filesContext.setMoreThanOneSelected(false);
      filesContext.setOneSelected(false);
    } else if (numSelected === 1) {
      filesContext.setMoreThanOneSelected(false);
      filesContext.setOneSelected(true);
      const title = first(filesMetadata.filter(d => d.selected)).title;
      attributesContext.setFieldValue('title', title || '');
    }
    filesContext.setMetadata(filesMetadata);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AttributesConsumer>
          {attributesContext => (
            <FilesConsumer>
              {filesContext => {
                const numSelected = filesContext.filesMetadata.filter(data => data.selected).length;
                return (
                  <Table className={classes.table}>
                    <SongsTableHead
                      numSelected={numSelected}
                      onSelectAllClick={evt => this.handleSelectAllClick(evt, filesContext, attributesContext)}
                      rowCount={filesContext.filesMetadata.length}
                    />
                    <TableBody>
                      {filesContext.filesMetadata.map((row, idx) => (
                        <TableRow
                          hover
                          onClick={event => this.handleClick(event, idx, filesContext, attributesContext)}
                          role="checkbox"
                          aria-checked={row.selected}
                          tabIndex={-1}
                          key={row.fileName + idx}
                          selected={row.selected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={row.selected || false} />
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.numbering}
                          </TableCell>
                          <TableCell>{row.title}</TableCell>
                          <TableCell>{row.artist}</TableCell>
                          <TableCell>{row.fileName}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                );
              }}
            </FilesConsumer>
          )}
        </AttributesConsumer>
      </div>
    );
  }
}

export default withStyles(styles)(SongsTable);
