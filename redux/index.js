import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import chat from './chat';
import ws from './ws';

export default combineReducers({
  router,
  chat,
  ws,
});
