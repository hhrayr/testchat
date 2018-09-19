export const ON_MESSAGE_ADD = '@testchat/on/message/sent';
export const ON_USER_ADD = '@testchat/on/user/add';
export const ON_USER_REMOVE = '@testchat/on/user/remove';

export default class ChatSession {
  users = [];
  messages = [];
  eventHandlers = {};
  messageId = 0;

  static SYSTEM_USER = 'SYSTEM_USER';

  addUser(user) {
    if (!user) {
      throw new Error('Invalid user');
    }
    if (this.users.indexOf(user) !== -1) {
      throw new Error('The given user is already in current session');
    }
    this.users.push(user);
    this.doEvent(ON_USER_ADD, user);

    const userAddSystemMessage = `${user} has joined`;
    this.addMessage(userAddSystemMessage, ChatSession.SYSTEM_USER);
  }

  removeUser(user) {
    const userIndex = this.users.indexOf(user);
    if (userIndex === -1) {
      throw new Error('The givent user does not exist in current session');
    }
    this.users.splice(userIndex, 1);
    this.doEvent(ON_USER_REMOVE, user);

    const userRemoveSystemMessage = `${user} has left`;
    this.addMessage(userRemoveSystemMessage, ChatSession.SYSTEM_USER);
  }

  addMessage(message, user) {
    if (!message) {
      throw new Error('Invalid message');
    }
    if (!user) {
      throw new Error('Invalid user');
    }
    if (user !== ChatSession.SYSTEM_USER && this.users.indexOf(user) === -1) {
      throw new Error('The givent user does not exist in current session');
    }
    const messageData = {
      __id: ++this.messageId,
      __timestamp: new Date().getTime(),
      message,
      user,
    };
    this.messages.push(messageData);
    this.doEvent(ON_MESSAGE_ADD, messageData);
  }

  addOnMessageSentEventListener(handler) {
    this.addEventListner(ON_MESSAGE_ADD, handler);
  }

  addEventListner(event, handler) {
    if (typeof handler !== 'function') {
      throw new Error('handler is not a function');
    }
    if (typeof this.eventHandlers[event] === 'undefined') {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }

  removeOnMessageSentEventListener(handler) {
    this.removeEventListener(ON_MESSAGE_ADD, handler);
  }

  removeEventListener(event, handler) {
    if (Array.isArray(this.eventHandlers[event])) {
      const eventIndex = this.eventHandlers[event].indexOf(handler);
      if (eventIndex !== -1) {
        this.eventHandlers[event].splice(eventIndex, 1);
      }
    }
  }

  flush() {
    this.eventHandlers = {};
    this.messages = [];
  }

  doEvent(event, data) {
    if (Array.isArray(this.eventHandlers[event])) {
      this.eventHandlers[event].forEach((handler) => {
        handler(data);
      });
    }
  }
}
