import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import AttributeInput from './AttributeInput';

const AttributesSegment = ({ style }) => {
  const filesLoaded = useSelector(state => state.filesActions.filesLoaded);
  const selectionState = useSelector(state => state.inputActions);
  const oldStyle = cloneDeep(style);
  let newStyle = Object.assign(oldStyle, { top: 77 });
  const fields = ['title', 'artist', 'albumArtist', 'album', 'genre', 'year', 'comment'];
  return (
    <div style={newStyle}>
      {fields.map(type => {
        return (
          <AttributeInput
            type={type}
            filesLoaded={filesLoaded}
            oneSelected={selectionState.oneSelected}
            moreThanOneSelected={selectionState.moreThanOneSelected}
            allSelected={selectionState.allSelected}
            key={type}
          />
        );
      })}
    </div>
  );
};

export default AttributesSegment;
