import { WS_CONNECT } from '../wsMiddleware';

export const connect = () => {
  return { type: WS_CONNECT };
};
