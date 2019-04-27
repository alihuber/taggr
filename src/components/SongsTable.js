import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { FilesConsumer } from '../contexts/FilesContext';

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
  handleSelectAllClick = (event, context) => {
    const value = event.target.checked;
    context.filesMetadata.forEach(metadata => {
      metadata.selected = value;
    });
    context.setAllSelected(value);
    context.setMetadata(context.filesMetadata);
  };

  handleClick = (evt, idx, context) => {
    const { filesMetadata } = context;
    const value = filesMetadata[idx].selected;
    filesMetadata[idx].selected = !value;
    context.setMetadata(filesMetadata);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <FilesConsumer>
          {context => {
            const numSelected = context.filesMetadata.filter(data => data.selected).length;
            return (
              <Table className={classes.table}>
                <SongsTableHead
                  numSelected={numSelected}
                  onSelectAllClick={evt => this.handleSelectAllClick(evt, context)}
                  rowCount={context.filesMetadata.length}
                />
                <TableBody>
                  {context.filesMetadata.map((row, idx) => (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, idx, context)}
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
      </div>
    );
  }
}

export default withStyles(styles)(SongsTable);
