import React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import first from 'lodash/first';
import { FilesConsumer } from '../contexts/FilesContext';
import { AttributesConsumer } from '../contexts/AttributesContext';
import AttributeInput from './AttributeInput';

const allEqual = arr => arr.every(v => v === arr[0]);

class AttributesSegment extends React.Component {
  placeholderText = (fieldName, filesContext) => {
    const multipleSelected = '(multiple selected)';
    const multipleEntries = '(multiple entries)';
    const { filesMetadata } = filesContext;
    if (fieldName === 'title') {
      if (filesContext.moreThanOneSelected) {
        return multipleSelected;
      } else if (filesContext.oneSelected) {
        const data = first(filesMetadata.filter(d => d.selected));
        return data[fieldName].length !== 0 ? data[fieldName] : fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      } else if (!filesContext.oneSelected && !filesContext.moreThanOneSelected) {
        return '';
      }
    } else {
      if (filesContext.moreThanOneSelected) {
        return multipleSelected;
      } else if (filesContext.oneSelected) {
        const data = first(filesMetadata.filter(d => d.selected));
        return data[fieldName].length !== 0 ? data[fieldName] : fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
      } else if (!filesContext.oneSelected && !filesContext.moreThanOneSelected) {
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
    const { style } = this.props;
    const oldStyle = cloneDeep(style);
    let newStyle = Object.assign(oldStyle, { top: 77 });
    const fields = ['title', 'artist', 'albumArtist', 'album', 'genre', 'year', 'comment'];
    return (
      <div style={newStyle}>
        <AttributesConsumer>
          {attributesContext => (
            <FilesConsumer>
              {filesContext => {
                return fields.map(type => {
                  const plText = this.placeholderText(type, filesContext);
                  return (
                    <AttributeInput
                      type={type}
                      filesLoaded={filesContext.filesLoaded}
                      oneSelected={filesContext.oneSelected}
                      moreThanOneSelected={filesContext.moreThanOneSelected}
                      allSelected={filesContext.allSelected}
                      filesContext={filesContext}
                      placeholderText={plText}
                      setFieldValue={attributesContext.setFieldValue}
                      getFieldValue={attributesContext.getFieldValue}
                      key={type}
                    />
                  );
                });
              }}
            </FilesConsumer>
          )}
        </AttributesConsumer>
      </div>
    );
  }
}

export default AttributesSegment;
