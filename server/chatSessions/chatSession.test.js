import ChatSession, { ON_USER_ADD } from './chatSession';

const testUser1 = 'test user 1';
const testUser2 = 'test user 2';

describe('ChatSession', () => {
  it('should add/remove users', (done) => {
    const testChatSession = new ChatSession();

    testChatSession.addUser(testUser1);
    testChatSession.addUser(testUser2);
    expect(testChatSession.users.length).toBe(2);

    expect(() => {
      testChatSession.addUser(testUser2);
    }).toThrow();
    expect(() => {
      testChatSession.addUser();
    }).toThrow();

    testChatSession.removeUser(testUser2);
    expect(testChatSession.users.length).toBe(1);

    done();
  });

  it('should add messages on add/remove users', (done) => {
    const testChatSession = new ChatSession();
    testChatSession.addEventListner(ON_USER_ADD, (user) => {
      expect(user).toBe(testUser1);

      setTimeout(() => {
        expect(testChatSession.messages.length).toBe(1);
        expect(testChatSession.messages[0].user).toBe(ChatSession.SYSTEM_USER);
        expect(testChatSession.messages[0].message).toContain(testUser1);

        testChatSession.removeUser(testUser1);

        setTimeout(() => {
          expect(testChatSession.messages.length).toBe(2);
          expect(testChatSession.messages[1].user).toBe(ChatSession.SYSTEM_USER);
          expect(testChatSession.messages[1].message).toContain(testUser1);

          done();
        }, 200);
      }, 200);
    });

    testChatSession.addUser(testUser1);
  });

  it('should add a message', (done) => {
    const testChatSession = new ChatSession();
    testChatSession.addUser(testUser1);

    testChatSession.addMessage('test message', testUser1);
    expect(testChatSession.messages.length).toBe(2);
    expect(testChatSession.messages[1].__id).toBe(2);
    expect(testChatSession.messages[1].user).toBe(testUser1);

    done();
  });

  it('should not add an invalid message', (done) => {
    const testChatSession = new ChatSession();
    testChatSession.addUser(testUser1);

    expect(() => {
      testChatSession.addMessage('', testUser1);
    }).toThrow();
    expect(() => {
      testChatSession.addMessage('message', 'invalid user');
    }).toThrow();
    done();
  });

  it('should add/remove events', (done) => {
    const testChatSession = new ChatSession();
    testChatSession.addUser(testUser1);

    const testHandler1 = () => { };
    const testHandler2 = () => { };

    testChatSession.addEventListner('testEvent', testHandler1);
    testChatSession.addEventListner('testEvent', testHandler2);
    expect(testChatSession.eventHandlers.testEvent.length).toBe(2);

    testChatSession.removeEventListener('testEvent', testHandler1);
    expect(testChatSession.eventHandlers.testEvent.length).toBe(1);
    expect(testChatSession.eventHandlers.testEvent[0]).toEqual(testHandler2);

    done();
  });

  it('should fire on message event', (done) => {
    const testChatSession = new ChatSession();
    testChatSession.addUser(testUser1);

    let testMessage;
    testChatSession.addOnMessageSentEventListener((message) => {
      testMessage = message;
    });
    testChatSession.addMessage('test message', testUser1);
    expect(testMessage.message).toBe('test message');
    expect(testMessage.user).toBe(testUser1);

    done();
  });
});
