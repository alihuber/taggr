import { SET_FILES_LOADED, SET_FILE_PATHS, SET_FILES_METADATA } from '../actions/types';
import cloneDeep from 'lodash/cloneDeep';

const initialState = { filesLoaded: false, filePaths: [] };

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_FILES_LOADED:
      return {
        ...state,
        filesLoaded: !!action.payload,
      };
    case SET_FILE_PATHS:
      return {
        ...state,
        filePaths: action.payload,
      };
    case SET_FILES_METADATA:
      return {
        ...state,
        metadata: cloneDeep(action.payload),
      };
    default:
      return state;
  }
}
