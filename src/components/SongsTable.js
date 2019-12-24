import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import { SET_ALL_SELECTED, SET_SELECTED_SONG } from '../actions/types';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing() * 3,
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

const SongsTableHead = ({ onSelectAllClick, numSelected, rowCount }) => {
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
};

const SongsTable = ({ classes }) => {
  const metadata = useSelector(state => state.inputActions.workingMetadata);
  const selectedIds = useSelector(state => state.inputActions.selectedIds);
  const dispatch = useDispatch();
  const handleSelectAllClick = event => {
    const allChecked = event.target.checked;
    if (allChecked) {
      dispatch({ type: SET_ALL_SELECTED, payload: true });
    } else {
      dispatch({ type: SET_ALL_SELECTED, payload: false });
    }
  };

  const handleClick = (evt, _id, idx) => {
    dispatch({ type: SET_SELECTED_SONG, payload: { checked: evt.target.checked, _id } });
  };

  const numSelected = selectedIds.length;
  return (
    <div className={classes.root}>
      <Table className={classes.table}>
        <SongsTableHead numSelected={numSelected} onSelectAllClick={evt => handleSelectAllClick(evt)} rowCount={metadata.length} />
        <TableBody>
          {metadata &&
            metadata.map((row, idx) => (
              <TableRow
                hover
                onClick={event => handleClick(event, row._id, idx)}
                role="checkbox"
                aria-checked={row.selected}
                tabIndex={-1}
                key={row._id}
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
    </div>
  );
};

SongsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SongsTable);
