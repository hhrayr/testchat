import ChatSession from './chatSession';

const ON_SESSION_CREATED = 'ON_SESSION_CREATED';

class ChatSessions {
  inMemSessions = {};
  eventHandlers = {
    [ON_SESSION_CREATED]: [],
  };

  createSession() {
    const token = `session_${new Date().getTime()}`;
    this.inMemSessions[token] = new ChatSession();
    this.eventHandlers[ON_SESSION_CREATED].forEach((handler) => {
      handler(token);
    });
    return token;
  }

  getSession(token) {
    if (typeof this.inMemSessions[token] === 'undefined') {
      throw new Error('Invalid tocken');
    }
    return this.inMemSessions[token];
  }

  getSessions() {
    return Object.keys(this.inMemSessions);
  }

  flush() {
    Object.keys(this.inMemSessions).forEach((key) => {
      delete this.inMemSessions[key];
    });
    this.eventHandlers[ON_SESSION_CREATED] = [];
  }

  addOnSessionCreatedEventListener(handler) {
    this.eventHandlers[ON_SESSION_CREATED].push(handler);
  }
}

const chatSessions = new ChatSessions();

export default chatSessions;
