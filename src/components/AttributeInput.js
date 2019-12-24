import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { SET_ALBUM_ARTIST_VALUE, SET_WORKING_METADATA } from '../actions/types';

const styles = theme => ({
  formControl: {
    margin: theme.spacing(),
    width: '96%',
  },
});

const AttributeInput = ({ classes, type, filesLoaded, oneSelected, moreThanOneSelected, allSelected }) => {
  const dispatch = useDispatch();
  const metadata = useSelector(state => state.inputActions.workingMetadata);
  const inputState = useSelector(state => state.inputActions);

  const handleBlur = (fieldName, event) => {
    // copy fields to working metadata
    const newValue = event.target.value;
    const selectedIds = inputState.selectedIds;
    metadata.forEach(data => {
      if (selectedIds.includes(data._id)) {
        data[fieldName] = newValue;
        if (fieldName === 'artist' && data.albumArtist.length === 0) {
          data.albumArtist = newValue;
          dispatch({ type: SET_ALBUM_ARTIST_VALUE, payload: newValue });
        }
      }
    });
    let actionStr;
    if (fieldName === 'albumArtist') {
      actionStr = `SET_ALBUM_ARTIST_VALUE`;
    } else {
      actionStr = `SET_${fieldName.toUpperCase()}_VALUE`;
    }
    dispatch({ type: actionStr, payload: newValue });
    dispatch({ type: SET_WORKING_METADATA, payload: metadata });
  };

  const handleChange = (fieldName, event) => {
    let actionStr;
    if (fieldName === 'albumArtist') {
      actionStr = `SET_ALBUM_ARTIST_VALUE`;
    } else {
      actionStr = `SET_${fieldName.toUpperCase()}_VALUE`;
    }
    dispatch({ type: actionStr, payload: event.target.value });
  };

  const valueText = fieldName => {
    const valString = `${fieldName}Value`;
    return inputState[valString];
  };

  const label = type.charAt(0).toUpperCase() + type.slice(1);
  let disabled = false;
  if (type === 'title') {
    disabled = !filesLoaded || !oneSelected || allSelected || moreThanOneSelected;
  } else {
    disabled = !filesLoaded || !oneSelected;
  }
  const value = valueText(type);
  return (
    <FormControl className={classes.formControl}>
      <InputLabel htmlFor="component-simple" shrink>
        {label}
      </InputLabel>
      <Input
        disabled={disabled}
        id="component-simple"
        value={value}
        onChange={event => handleChange(type, event)}
        onBlur={event => handleBlur(type, event)}
      />
    </FormControl>
  );
};

AttributeInput.propTypes = {
  classes: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  filesLoaded: PropTypes.bool.isRequired,
  oneSelected: PropTypes.bool.isRequired,
  moreThanOneSelected: PropTypes.bool.isRequired,
  allSelected: PropTypes.bool.isRequired,
};

export default withStyles(styles)(AttributeInput);
