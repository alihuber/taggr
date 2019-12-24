import { SET_FILES_LOADED, SET_FILE_PATHS } from '../actions/types';

const initialState = { imageLoaded: false, filesLoaded: false, filePaths: [] };

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
    default:
      return state;
  }
}
