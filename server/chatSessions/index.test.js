import chatSessions from './index';

describe('ChatSession', () => {
  afterEach(() => {
    chatSessions.flush();
  });

  it('should create/get session', (done) => {
    const token = chatSessions.createSession();
    expect(token).toBeDefined();

    const session = chatSessions.getSession(token);
    expect(session).toBeDefined();
    expect(chatSessions.getSession(token)).toBe(session);

    expect(() => { chatSessions.getSession('invalid token'); }).toThrow();

    done();
  });

  it('should get all sessions', (done) => {
    let sessions = chatSessions.getSessions();
    expect(sessions.length).toBe(0);

    const token1 = chatSessions.createSession();
    setTimeout(() => {
      const token2 = chatSessions.createSession();
      sessions = chatSessions.getSessions();

      expect(sessions.length).toBe(2);
      expect(sessions).toContain(token1);
      expect(sessions).toContain(token2);

      done();
    }, 100);
  });
});
