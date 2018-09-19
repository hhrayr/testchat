import { WS_CONNECTED, WS_DISCONNECTED } from '../wsMiddleware';
import initialState from './initialState';

export default function (state = initialState, action) {
  switch (action.type) {
    case WS_CONNECTED:
      return {
        ...state,
        connection: action.payload.socket,
      };
    case WS_DISCONNECTED:
      return {
        ...state,
        connection: null,
      };
    default:
      return state;
  }
}
