import { combineReducers } from 'redux';
import messages from './messages';
import filenameDialogs from './filenameDialogs';
import filesActions from './filesActions';
import inputActions from './inputActions';

export default combineReducers({ messages, filenameDialogs, filesActions, inputActions });
