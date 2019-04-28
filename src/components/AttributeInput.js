import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

const allEqual = arr => arr.every(v => v === arr[0]);

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    width: '96%',
  },
});

class AttributeInput extends React.Component {
  handleBlur = (fieldName, event, filesContext) => {
    const { filesMetadata } = filesContext;
    filesMetadata.forEach(data => {
      if (data.selected) {
        data[fieldName] = event.target.value;
      }
    });
    filesContext.setMetadata(filesMetadata);
  };

  handleChange = (fieldName, event, setFieldValue) => {
    setFieldValue(fieldName, event.target.value);
  };

  valueText = (fieldName, moreThanOneSelected, oneSelected, filesContext, getFieldValue) => {
    const multipleSelected = '(multiple selected)';
    const multipleEntries = '(multiple entries)';
    const { filesMetadata } = filesContext;
    if (fieldName === 'title') {
      if (moreThanOneSelected) {
        return multipleSelected;
      } else if (oneSelected) {
        return getFieldValue(fieldName);
      } else if (!oneSelected && !moreThanOneSelected) {
        return '';
      }
    } else {
      if (oneSelected || moreThanOneSelected) {
        return getFieldValue(fieldName);
      } else if (!oneSelected && !moreThanOneSelected) {
        const collectedFields = [];
        filesMetadata.forEach(d => {
          collectedFields.push(d[fieldName]);
        });
        if (allEqual(collectedFields)) {
          return collectedFields[0];
        } else {
          return multipleEntries;
        }
      } else {
        return fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      }
    }
  };

  render() {
    const {
      classes,
      type,
      filesLoaded,
      oneSelected,
      moreThanOneSelected,
      allSelected,
      placeholderText,
      setFieldValue,
      getFieldValue,
      filesContext,
    } = this.props;
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    let disabled;
    if (type === 'title') {
      disabled = !filesLoaded || !oneSelected || allSelected || moreThanOneSelected;
    } else {
      disabled = !filesLoaded || !oneSelected;
    }
    const value = this.valueText(type, moreThanOneSelected, oneSelected, filesContext, getFieldValue);
    return (
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="component-simple" shrink>
          {label}
        </InputLabel>
        <Input
          placeholder={placeholderText}
          disabled={disabled}
          id="component-simple"
          value={value}
          onChange={event => this.handleChange(type, event, setFieldValue)}
          onBlur={event => this.handleBlur(type, event, filesContext)}
        />
      </FormControl>
    );
  }
}

export default withStyles(styles)(AttributeInput);
