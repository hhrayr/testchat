/* eslint-disable no-console */
import chatSessions from '../chatSessions';
import { ON_USER_ADD, ON_USER_REMOVE } from '../chatSessions/chatSession';
import * as wsServerMessages from '../../utils/wsServerMessages';

export default function (io) {
  io.on('connection', (socket) => {
    console.log('conected', socket.id);

    socket.on('disconnect', () => {
      console.log('disconnect');
    });

    socket.on(wsServerMessages.WS_SERVER_MESSAGE, (message) => {
      console.log('received', wsServerMessages.WS_SERVER_MESSAGE, message);

      switch (message.type) {
        case wsServerMessages.WS_SERVER_CHAT_SESSION_CREATE: {
          consumeCreateChatSessionMessage(message);
          break;
        }
        case wsServerMessages.WS_SERVER_CHAT_USER_ADD: {
          consumeAddUserMessage(message);
          break;
        }
        case wsServerMessages.WS_SERVER_CHAT_USER_REMOVE: {
          consumeRemoveUserMessage(message);
          break;
        }
        case wsServerMessages.WS_SERVER_CHAT_MESSAGE_SEND: {
          consumeMessageSendMessage(message);
          break;
        }
        default: break;
      }
    });

    const consumeCreateChatSessionMessage = (message) => {
      try {
        const token = chatSessions.createSession();
        const session = chatSessions.getSession(token);
        const messageData = {
          type: wsServerMessages.WS_SERVER_CHAT_SESSION_CREATED,
          data: { token },
        };
        io.emit(wsServerMessages.WS_SERVER_MESSAGE, messageData);
        console.log('emitted', wsServerMessages.WS_SERVER_MESSAGE, messageData);
        session.addEventListner(ON_USER_ADD, onUserAddedHandler(token));
        session.addEventListner(ON_USER_REMOVE, onUserReovedHandler(token));
        session.addOnMessageSentEventListener(onMessageReceivedHandler(token));
      } catch (e) {
        const errorMessageData = {
          type: wsServerMessages.WS_SERVER_CHAT_SESSION_CREATE,
          error: e,
          data: {
            ...message.data,
          },
        };
        io.emit(wsServerMessages.WS_SERVER_ERROR, errorMessageData);
        console.log('emitted', wsServerMessages.WS_SERVER_ERROR, errorMessageData);
      }
    };

    const consumeAddUserMessage = (message) => {
      const errorMessageData = {
        type: wsServerMessages.WS_SERVER_CHAT_USER_ADD,
        data: message.data,
      };
      if (message.token && message.data && message.data.user) {
        try {
          chatSessions.getSession(message.token).addUser(message.data.user);
        } catch (e) {
          errorMessageData.error = { message: e.message };
          socket.emit(wsServerMessages.WS_SERVER_ERROR, errorMessageData);
          console.log('emitted', wsServerMessages.WS_SERVER_ERROR, errorMessageData);
        }
      } else {
        errorMessageData.error = { message: 'invalid user data' };
        socket.emit(wsServerMessages.WS_SERVER_ERROR, errorMessageData);
        console.log('emitted', wsServerMessages.WS_SERVER_ERROR, errorMessageData);
      }
    };

    const consumeRemoveUserMessage = (message) => {
      const errorMessageData = {
        type: wsServerMessages.WS_SERVER_CHAT_USER_REMOVE,
        data: message.data,
      };
      if (message.token && message.data && message.data.user) {
        try {
          chatSessions.getSession(message.token).removeUser(message.data.user);
        } catch (e) {
          errorMessageData.error = { message: e.message };
          socket.emit(wsServerMessages.WS_SERVER_ERROR, errorMessageData);
          console.log('emitted', wsServerMessages.WS_SERVER_ERROR, errorMessageData);
        }
      } else {
        errorMessageData.error = { message: 'invalid user data' };
        socket.emit(wsServerMessages.WS_SERVER_ERROR, errorMessageData);
        console.log('emitted', wsServerMessages.WS_SERVER_ERROR, errorMessageData);
      }
    };

    const consumeMessageSendMessage = (message) => {
      const errorMessageData = {
        type: wsServerMessages.WS_SERVER_CHAT_MESSAGE_SEND,
        data: message.data,
      };
      if (message.token && message.data && message.data.message && message.data.user) {
        try {
          chatSessions.getSession(message.token).addMessage(
            message.data.message,
            message.data.user,
          );
        } catch (e) {
          errorMessageData.error = { message: e.message };
          socket.emit(wsServerMessages.WS_SERVER_ERROR, errorMessageData);
          console.log('emitted', wsServerMessages.WS_SERVER_ERROR, errorMessageData);
        }
      } else {
        errorMessageData.error = { message: 'invalid message' };
        socket.emit(wsServerMessages.WS_SERVER_ERROR, errorMessageData);
        console.log('emitted', wsServerMessages.WS_SERVER_ERROR, errorMessageData);
      }
    };

    const onUserAddedHandler = (token) => {
      return (user) => {
        const messageData = {
          type: wsServerMessages.WS_SERVER_CHAT_USER_ADDED,
          token,
          data: { user },
        };
        io.sockets.emit(wsServerMessages.WS_SERVER_MESSAGE, messageData);
        console.log('emitted', wsServerMessages.WS_SERVER_MESSAGE, messageData);
      };
    };

    const onUserReovedHandler = (token) => {
      return (user) => {
        const messageData = {
          type: wsServerMessages.WS_SERVER_CHAT_USER_REMOVED,
          token,
          data: { user },
        };
        io.sockets.emit(wsServerMessages.WS_SERVER_MESSAGE, messageData);
        console.log('emitted', wsServerMessages.WS_SERVER_MESSAGE, messageData);
      };
    };

    const onMessageReceivedHandler = (token) => {
      return (data) => {
        const messageData = {
          type: wsServerMessages.WS_SERVER_CHAT_MESSAGE_RECEIVED,
          token,
          data,
        };
        io.sockets.emit(wsServerMessages.WS_SERVER_MESSAGE, messageData);
        console.log('emitted', wsServerMessages.WS_SERVER_MESSAGE, messageData);
      };
    };
  });
}
