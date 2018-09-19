import io from 'socket.io-client';
import ioBack from 'socket.io';
import http from 'http';
import chatWsHandler from './chatWs';
import chatSessions from '../chatSessions';
import * as wsServerMessages from '../../utils/wsServerMessages';

describe('Chat Ws', () => {
  let httpServer;
  let httpServerAddr;
  let ioServer;
  let socket;

  beforeAll((done) => {
    httpServer = http.createServer();
    httpServerAddr = httpServer.listen().address();
    ioServer = ioBack(httpServer);
    chatWsHandler(ioServer);
    done();
  });

  afterAll((done) => {
    ioServer.close();
    httpServer.close();
    done();
  });

  beforeEach((done) => {
    socket = io.connect(`http://[${httpServerAddr.address}]:${httpServerAddr.port}`, {
      transports: ['polling', 'websocket'],
    });
    socket.on('connect', () => {
      done();
    });
  });

  afterEach((done) => {
    if (socket.connected) {
      socket.disconnect();
    }
    done();
  });

  it('should create a session', (done) => {
    socket.emit(wsServerMessages.WS_SERVER_MESSAGE, {
      type: wsServerMessages.WS_SERVER_CHAT_SESSION_CREATE,
    });

    socket.once(wsServerMessages.WS_SERVER_MESSAGE, (message) => {
      expect(message.type).toBe(wsServerMessages.WS_SERVER_CHAT_SESSION_CREATED);
      expect(message.data.token).toBeDefined();

      done();
    });
  });

  it('should create add/remove user', (done) => {
    socket.emit(wsServerMessages.WS_SERVER_MESSAGE, {
      type: wsServerMessages.WS_SERVER_CHAT_SESSION_CREATE,
    });

    socket.once(wsServerMessages.WS_SERVER_MESSAGE, (message) => {
      expect(message.type).toBe(wsServerMessages.WS_SERVER_CHAT_SESSION_CREATED);

      const { token } = message.data;
      const session = chatSessions.getSession(token);

      socket.emit(wsServerMessages.WS_SERVER_MESSAGE, {
        type: wsServerMessages.WS_SERVER_CHAT_USER_ADD,
        token,
        data: { user: 'Test User' },
      });

      socket.once(wsServerMessages.WS_SERVER_MESSAGE, (userAddedMessage) => {
        expect(userAddedMessage.type).toBe(wsServerMessages.WS_SERVER_CHAT_USER_ADDED);
        expect(userAddedMessage.token).toBe(token);
        expect(userAddedMessage.data.user).toBe('Test User');
        expect(session.users).toContainEqual('Test User');

        socket.emit(wsServerMessages.WS_SERVER_MESSAGE, {
          type: wsServerMessages.WS_SERVER_CHAT_USER_REMOVE,
          token,
          data: { user: 'Test User' },
        });

        socket.once(wsServerMessages.WS_SERVER_MESSAGE, (systemMessage) => {
          expect(systemMessage.type).toBe(wsServerMessages.WS_SERVER_CHAT_MESSAGE_RECEIVED);

          socket.once(wsServerMessages.WS_SERVER_MESSAGE, (userRemovedMessage) => {
            expect(userRemovedMessage.type).toBe(wsServerMessages.WS_SERVER_CHAT_USER_REMOVED);
            expect(userRemovedMessage.token).toBe(token);
            expect(userRemovedMessage.data.user).toBe('Test User');
            expect(session.users).not.toContainEqual('Test User');

            done();
          });
        });
      });
    });
  });

  it('should add a message', (done) => {
    socket.emit(wsServerMessages.WS_SERVER_MESSAGE, {
      type: wsServerMessages.WS_SERVER_CHAT_SESSION_CREATE,
    });

    socket.once(wsServerMessages.WS_SERVER_MESSAGE, (message) => {
      expect(message.type).toBe(wsServerMessages.WS_SERVER_CHAT_SESSION_CREATED);

      const { token } = message.data;

      socket.emit(wsServerMessages.WS_SERVER_MESSAGE, {
        type: wsServerMessages.WS_SERVER_CHAT_USER_ADD,
        token,
        data: { user: 'Test User' },
      });

      socket.once(wsServerMessages.WS_SERVER_MESSAGE, (userAddedMessage) => {
        expect(userAddedMessage.type).toBe(wsServerMessages.WS_SERVER_CHAT_USER_ADDED);

        socket.once(wsServerMessages.WS_SERVER_MESSAGE, (systemMessage) => {
          expect(systemMessage.type).toBe(wsServerMessages.WS_SERVER_CHAT_MESSAGE_RECEIVED);
          expect(systemMessage.data.message).toContain('Test User');

          socket.emit(wsServerMessages.WS_SERVER_MESSAGE, {
            type: wsServerMessages.WS_SERVER_CHAT_MESSAGE_SEND,
            token,
            data: {
              message: 'Test Message',
              user: 'Test User',
            },
          });

          socket.once(wsServerMessages.WS_SERVER_MESSAGE, (messageReceivedMessage) => {
            expect(systemMessage.type).toBe(wsServerMessages.WS_SERVER_CHAT_MESSAGE_RECEIVED);
            expect(messageReceivedMessage.data.message).toBe('Test Message');
            expect(messageReceivedMessage.data.user).toBe('Test User');

            done();
          });
        });
      });
    });
  });

  it('should emit an error on invalid user data', (done) => {
    socket.emit(wsServerMessages.WS_SERVER_MESSAGE, {
      type: wsServerMessages.WS_SERVER_CHAT_SESSION_CREATE,
    });

    socket.once(wsServerMessages.WS_SERVER_MESSAGE, (message) => {
      expect(message.type).toBe(wsServerMessages.WS_SERVER_CHAT_SESSION_CREATED);

      const { token } = message.data;

      socket.emit(wsServerMessages.WS_SERVER_MESSAGE, {
        type: wsServerMessages.WS_SERVER_CHAT_USER_ADD,
        token,
        data: { invalid: 'invalid' },
      });

      socket.once(wsServerMessages.WS_SERVER_ERROR, (userAddedMessage) => {
        expect(userAddedMessage.type).toBe(wsServerMessages.WS_SERVER_CHAT_USER_ADD);
        expect(userAddedMessage.error).toBeDefined();

        done();
      });
    });
  });
});
