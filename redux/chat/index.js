import { cloneDeep } from 'lodash';
import * as constants from './constants';
import initialState from './initialState';

export default function (state = initialState, action) {
  const newState = cloneDeep(state);
  switch (action.type) {
    case constants.SESSION_GET_ALL: {
      newState.sessions.loading = true;
      break;
    }
    case constants.SESSION_GET_ALL_SUCCESS: {
      newState.sessions.loading = false;
      newState.sessions.data = action.payload;
      break;
    }
    case constants.SESSION_GET_ALL_ERROR: {
      newState.sessions.loading = false;
      newState.sessions.loadingError = action.payload;
      break;
    }
    case constants.SESSION_CREATE: {
      newState.sessions.creating = true;
      newState.sessions.createdSession = null;
      break;
    }
    case constants.SESSION_CREATE_SUCCESS: {
      const data = newState.sessions.data || [];
      if (data.indexOf(action.payload === -1)) {
        data.push(action.payload);
      }
      newState.sessions.creating = false;
      newState.sessions.createdSession = action.payload;
      newState.sessions.data = data;
      break;
    }
    case constants.SESSION_CREATE_ERROR: {
      newState.sessions.createdSession = null;
      newState.sessions.creating = false;
      newState.sessions.creatingError = action.payload;
      break;
    }
    case constants.CHAT_CREATE: {
      newState.chat = {
        token: action.payload.token,
      };
      break;
    }
    case constants.USER_CREATE: {
      newState.chat.creatingUser = true;
      break;
    }
    case constants.USER_CREATE_SUCCESS: {
      newState.chat.user = action.payload.user;
      newState.chat.creatingUser = false;
      break;
    }
    case constants.USER_CREATE_ERROR: {
      newState.chat.creatingUserError = action.payload.error;
      newState.chat.creatingUser = false;
      break;
    }
    case constants.USER_CREATE_RESET: {
      newState.chat.creatingUserError = null;
      newState.chat.creatingUser = false;
      break;
    }
    case constants.MESSAGE_SEND_SUCCESS: {
      if (newState.chat) {
        const messages = newState.chat.messages || [];
        messages.push(action.payload.data);
        newState.chat.messages = messages;
      }
      break;
    }
    default:
      break;
  }
  return newState;
}
