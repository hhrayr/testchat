import * as constants from './constants';
import initialState from './initialState';

export default function (state = initialState, action) {
  switch (action.type) {
    case constants.SESSION_GET_ALL:
      return {
        ...state,
        sessions: {
          loading: true,
        },
      };
    case constants.SESSION_GET_ALL_SUCCESS:
      return {
        ...state,
        sessions: {
          loading: false,
          data: action.payload,
        },
      };
    case constants.SESSION_GET_ALL_ERROR:
      return {
        ...state,
        sessions: {
          loading: false,
          loadingError: action.payload,
        },
      };
    case constants.SESSION_CREATE: {
      return {
        ...state,
        sessions: {
          ...state.sessions,
          creating: true,
          createdSession: null,
        },
      };
    }
    case constants.SESSION_CREATE_SUCCESS: {
      const data = state.sessions.data || [];
      if (data.indexOf(action.payload === -1)) {
        data.push(action.payload);
      }
      return {
        ...state,
        sessions: {
          ...state.sessions,
          creating: false,
          createdSession: action.payload,
          data,
        },
      };
    }
    case constants.SESSION_CREATE_ERROR: {
      return {
        ...state,
        sessions: {
          ...state.sessions,
          createdSession: null,
          creating: false,
          creatingError: action.payload,
        },
      };
    }
    case constants.CHAT_CREATE: {
      return {
        ...state,
        chat: {
          token: action.payload.token,
        },
      };
    }
    case constants.USER_CREATE: {
      return {
        ...state,
        chat: {
          ...state.chat,
          creatingUser: true,
        },
      };
    }
    case constants.USER_CREATE_SUCCESS: {
      return {
        ...state,
        chat: {
          ...state.chat,
          user: action.payload.user,
          creatingUser: false,
        },
      };
    }
    case constants.USER_CREATE_ERROR: {
      return {
        ...state,
        chat: {
          ...state.chat,
          creatingUserError: action.payload.error,
          creatingUser: false,
        },
      };
    }
    case constants.USER_CREATE_RESET: {
      return {
        ...state,
        chat: {
          ...state.chat,
          creatingUserError: null,
          creatingUser: false,
        },
      };
    }
    case constants.MESSAGE_SEND_SUCCESS: {
      const messages = state.chat.messages || [];
      messages.push(action.payload.data);
      return {
        ...state,
        chat: {
          ...state.chat,
          messages,
        },
      };
    }
    default:
      return state;
  }
}
