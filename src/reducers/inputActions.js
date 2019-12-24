import map from 'lodash/map';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import uniq from 'lodash/uniq';

import {
  SET_SELECTED_SONG,
  SET_ALL_SELECTED,
  SET_TITLE_VALUE,
  SET_ARTIST_VALUE,
  SET_ALBUM_ARTIST_VALUE,
  SET_ALBUM_VALUE,
  SET_GENRE_VALUE,
  SET_YEAR_VALUE,
  SET_COMMENT_VALUE,
  SET_WORKING_METADATA,
  CLEAR_DATA,
} from '../actions/types';

const initialState = {
  oneSelected: false,
  allSelected: false,
  moreThanOneSelected: false,
  selectedIds: [],
  titleValue: '',
  artistValue: '',
  albumArtistValue: '',
  albumValue: '',
  genreValue: '',
  yearValue: '',
  commentValue: '',
  workingMetadata: [],
};

const allEqual = arr => arr.every(v => v === arr[0]);

const extractFieldFromMetadata = (fieldName, metadata) => {
  if (metadata) {
    const selected = metadata.find(m => m.selected);
    return selected[fieldName];
  } else return '';
};

const inputText = (fieldName, metadata) => {
  const multipleEntries = '(multiple entries)';
  const collectedFields = [];
  metadata &&
    metadata.forEach(data => {
      if (data.selected) {
        collectedFields.push(data[fieldName]);
      }
    });
  if (allEqual(collectedFields)) {
    return collectedFields[0];
  } else {
    return multipleEntries;
  }
};

const updateMetadata = (songData, metadata) => {
  remove(metadata, m => m._id === songData._id);
  metadata.push(songData);
  return metadata.sort(function(a, b) {
    return a.idx - b.idx;
  });
};

const setAllUnselected = metadata => {
  return metadata.map(m => {
    return { ...m, selected: false };
  });
};

const setAllSelected = metadata => {
  return metadata.map(m => {
    return { ...m, selected: true };
  });
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CLEAR_DATA:
      if (action.payload) {
        return {
          ...state,
          workingMetadata: new Array(),
          selectedIds: new Array(),
          oneSelected: false,
          moreThanOneSelected: false,
          allSelected: false,
          titleValue: '',
          artistValue: '',
          albumArtistValue: '',
          albumValue: '',
          genreValue: '',
          yearValue: '',
          commentValue: '',
        };
      } else {
        return {
          ...state,
        };
      }
    case SET_WORKING_METADATA:
      return {
        ...state,
        workingMetadata: cloneDeep(action.payload),
      };
    case SET_SELECTED_SONG:
      const selectedId = action.payload._id;
      const checked = action.payload.checked;
      let metadata;
      let selectedSong;
      if (checked) {
        // selectedId is set: add song to selected
        metadata = state.workingMetadata;
        selectedSong = metadata.find(m => m._id === selectedId);
        selectedSong.selected = true;
        const newMetadata = updateMetadata(selectedSong, metadata);
        const currentIds = new Array(...state.selectedIds);
        currentIds.push(selectedId);
        const newSelectedIds = uniq(currentIds);
        const oneSelected = newSelectedIds.length === 1;
        const moreThanOneSelected = newSelectedIds.length > 1;
        if (oneSelected) {
          return {
            ...state,
            selectedIds: new Array(...newSelectedIds),
            oneSelected,
            moreThanOneSelected,
            allSelected: false,
            titleValue: selectedSong.title,
            artistValue: selectedSong.artist,
            albumArtistValue: selectedSong.albumArtist,
            albumValue: selectedSong.album,
            genreValue: selectedSong.genre,
            yearValue: selectedSong.year,
            commentValue: selectedSong.comment,
            workingMetadata: cloneDeep(newMetadata),
          };
        } else if (moreThanOneSelected) {
          return {
            ...state,
            selectedIds: new Array(...newSelectedIds),
            allSelected: false,
            moreThanOneSelected: true,
            oneSelected: true,
            titleValue: '(more than one selected)',
            artistValue: inputText('artist', metadata),
            albumArtistValue: inputText('albumArtist', metadata),
            albumValue: inputText('album', metadata),
            genreValue: inputText('genre', metadata),
            yearValue: inputText('year', metadata),
            commentValue: inputText('comment', metadata),
            workingMetadata: cloneDeep(newMetadata),
          };
        }
      } else {
        // deselect song:
        metadata = state.workingMetadata;
        selectedSong = metadata.find(m => m._id === selectedId);
        selectedSong.selected = false;
        const newMetadata = updateMetadata(selectedSong, metadata);
        const newSelectedIds = new Array(...state.selectedIds);
        remove(newSelectedIds, id => id === selectedId);
        const oneSelected = newSelectedIds.length === 1;
        const moreThanOneSelected = newSelectedIds.length > 1;
        const allSelected = newSelectedIds.length === metadata.length;
        let newSelectedSong;
        if (oneSelected) {
          newSelectedSong = metadata.find(m => m.selected);
          return {
            ...state,
            selectedIds: new Array(...newSelectedIds),
            oneSelected,
            moreThanOneSelected: false,
            allSelected: false,
            titleValue: newSelectedSong.title,
            artistValue: newSelectedSong.artist,
            albumArtistValue: newSelectedSong.albumArtist,
            albumValue: newSelectedSong.album,
            genreValue: newSelectedSong.genre,
            yearValue: newSelectedSong.year,
            commentValue: newSelectedSong.comment,
            workingMetadata: cloneDeep(newMetadata),
          };
        } else if (moreThanOneSelected) {
          return {
            ...state,
            selectedIds: new Array(...newSelectedIds),
            allSelected: false,
            moreThanOneSelected: true,
            oneSelected: true,
            titleValue: '(more than one selected)',
            artistValue: inputText('artist', metadata),
            albumArtistValue: inputText('albumArtist', metadata),
            albumValue: inputText('album', metadata),
            genreValue: inputText('genre', metadata),
            yearValue: inputText('year', metadata),
            commentValue: inputText('comment', metadata),
            workingMetadata: cloneDeep(newMetadata),
          };
        } else {
          // nothing selected
          return {
            ...state,
            selectedIds: new Array(...newSelectedIds),
            oneSelected: false,
            moreThanOneSelected: false,
            allSelected: false,
            titleValue: '',
            artistValue: '',
            albumArtistValue: '',
            albumValue: '',
            genreValue: '',
            yearValue: '',
            commentValue: '',
            workingMetadata: cloneDeep(newMetadata),
          };
        }
      }
    case SET_ALL_SELECTED:
      let ids = [];
      metadata = state.workingMetadata;
      let oneSelected;
      let allSelected;
      let moreThanOneSelected;
      if (metadata.length > 1) {
        moreThanOneSelected = true;
        allSelected = true;
        oneSelected = true;
      } else if (metadata.length === 1) {
        oneSelected = true;
        allSelected = false;
        moreThanOneSelected = false;
      }
      let titleValue = '(more than one selected)';
      if (metadata.length === 1) {
        titleValue = metadata[0].title;
      }
      if (action.payload) {
        ids = map(metadata, '_id');
        const newMetadata = setAllSelected(metadata);
        return {
          ...state,
          selectedIds: new Array(...ids),
          allSelected,
          moreThanOneSelected,
          oneSelected,
          titleValue,
          artistValue: inputText('artist', newMetadata),
          albumArtistValue: inputText('albumArtist', newMetadata),
          albumValue: inputText('album', newMetadata),
          genreValue: inputText('genre', newMetadata),
          yearValue: inputText('year', newMetadata),
          commentValue: inputText('comment', newMetadata),
          workingMetadata: cloneDeep(newMetadata),
        };
      } else {
        // deselect all
        const newMetadata = setAllUnselected(metadata);
        return {
          ...state,
          selectedIds: new Array(),
          allSelected: false,
          moreThanOneSelected: false,
          oneSelected: false,
          titleValue: '',
          artistValue: '',
          albumArtistValue: '',
          albumValue: '',
          genreValue: '',
          yearValue: '',
          commentValue: '',
          workingMetadata: cloneDeep(newMetadata),
        };
      }
    case SET_TITLE_VALUE:
      return {
        ...state,
        titleValue: action.payload,
      };
    case SET_ARTIST_VALUE:
      return {
        ...state,
        artistValue: action.payload,
      };
    case SET_ALBUM_ARTIST_VALUE:
      return {
        ...state,
        albumArtistValue: action.payload,
      };
    case SET_ALBUM_VALUE:
      return {
        ...state,
        albumValue: action.payload,
      };
    case SET_GENRE_VALUE:
      return {
        ...state,
        genreValue: action.payload,
      };
    case SET_YEAR_VALUE:
      return {
        ...state,
        yearValue: action.payload,
      };
    case SET_COMMENT_VALUE:
      return {
        ...state,
        commentValue: action.payload,
      };
    default:
      return state;
  }
}
