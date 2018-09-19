import io from 'socket.io-client';
import * as wsServerMessages from '../utils/wsServerMessages';

export const WS_CONNECT = '@ws/client/connect';
export const WS_CONNECTED = '@ws/client/connected';
export const WS_DISCONNECTED = '@ws/client/disconnected';
export const WS_MESSAGE_RECEIVED = '@ws/client/message/received';
export const WS_MESSAGE_ERROR = '@ws/client/message/error';

const socketMiddleware = () => {
  let socket = null;

  return (store) => {
    const onConnected = () => {
      return () => {
        store.dispatch({ type: WS_CONNECTED, payload: { socket } });
      };
    };

    const onDisconnect = () => {
      return () => {
        store.dispatch({ type: WS_DISCONNECTED });
      };
    };

    const onMessageReceive = () => {
      return (data) => {
        store.dispatch({ type: WS_MESSAGE_RECEIVED, payload: data });
      };
    };

    const onMessageError = () => {
      return (data) => {
        store.dispatch({ type: WS_MESSAGE_ERROR, payload: data });
      };
    };

    return (next) => {
      return (action) => {
        switch (action.type) {
          case WS_CONNECT:
            if (socket != null) {
              socket.close();
            }
            socket = io({ transports: ['polling', 'websocket'] });
            socket.on('connect', onConnected());
            socket.on('reconnect', onConnected());
            socket.on('disconnect', onDisconnect());
            socket.on(wsServerMessages.WS_SERVER_MESSAGE, onMessageReceive());
            socket.on(wsServerMessages.WS_SERVER_ERROR, onMessageError());

            socket.emitServerMessage = (data) => {
              const messageData = { ...data };
              if (typeof messageData.data === 'undefined') {
                messageData.data = {};
              }
              if (typeof messageData.data.details === 'undefined') {
                messageData.data.details = {};
              }
              socket.emit(wsServerMessages.WS_SERVER_MESSAGE, messageData);
            };
            break;
          default:
            return next(action);
        }
        return next(action);
      };
    };
  };
};

export default socketMiddleware();
