import { Router as expressRouter } from 'express';
import chatSessions from '../chatSessions';

const router = expressRouter();

router.get('/sessions', (req, res) => {
  res.send(chatSessions.getSessions());
});

export default router;
