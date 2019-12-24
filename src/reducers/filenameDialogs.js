import { SET_FILENAME_DIALOG_OPEN, SET_NUMBERING_DIALOG } from '../actions/types';

const initialState = { filenameCopyDialogOpen: false, numberDialogOpen: false };

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_FILENAME_DIALOG_OPEN:
      return {
        ...state,
        filenameCopyDialogOpen: !!action.payload,
      };
    case SET_NUMBERING_DIALOG:
      return {
        ...state,
        numberDialogOpen: !!action.payload,
      };
    default:
      return state;
  }
}
