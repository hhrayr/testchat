import ChatSession from './chatSession';

class ChatSessions {
  inMemSessions = {};

  createSession() {
    const token = `session_${new Date().getTime()}`;
    this.inMemSessions[token] = new ChatSession();
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
  }
}

const chatSessions = new ChatSessions();

export default chatSessions;
