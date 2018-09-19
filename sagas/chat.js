import { takeEvery, call, put, select } from 'redux-saga/effects';
import * as actions from '../redux/chat/actions';
import * as constants from '../redux/chat/constants';
import { getSessions } from '../utils/chatApiProxy';
import * as wsServerMessages from '../utils/wsServerMessages';
import { WS_MESSAGE_RECEIVED, WS_MESSAGE_ERROR } from '../redux/wsMiddleware';

function* watchSocketMessage() {
  yield takeEvery(WS_MESSAGE_RECEIVED, receiveSocketMessageAsync);
}

function* receiveSocketMessageAsync(action) {
  switch (action.payload.type) {
    case wsServerMessages.WS_SERVER_CHAT_SESSION_CREATED: {
      const { token } = action.payload.data;
      yield put(actions.createSessionSuccess(token));
      break;
    }
    case wsServerMessages.WS_SERVER_CHAT_USER_ADDED: {
      const chat = yield select((state) => { return state.chat; });
      if (chat.chat && !chat.chat.user) {
        yield put(actions.createUserSuccess({
          user: action.payload.data.user,
        }));
      }
      break;
    }
    case wsServerMessages.WS_SERVER_CHAT_MESSAGE_RECEIVED: {
      yield put(actions.sendMessageSuccess({
        data: action.payload.data,
      }));
      break;
    }
    default: yield;
  }
}

function* watchSocketMessageError() {
  yield takeEvery(WS_MESSAGE_ERROR, receiveSocketMessageErrorAsync);
}

function* receiveSocketMessageErrorAsync(action) {
  switch (action.payload.type) {
    case wsServerMessages.WS_SERVER_CHAT_USER_ADD: {
      yield put(actions.createUserError({
        error: action.payload.error,
      }));
      break;
    }
    default: yield;
  }
}

function* watchSessionGetAll() {
  yield takeEvery(constants.SESSION_GET_ALL, sessionGetAllAsync);
}

function* sessionGetAllAsync() {
  try {
    const sessions = yield call(getSessions);
    yield put(actions.getAllSessionsSuccess(sessions));
  } catch (err) {
    yield put(actions.getAllSessionsError(err));
  }
}

function* watchSessionCreate() {
  yield takeEvery(constants.SESSION_CREATE, sessionCreateAsync);
}

function* sessionCreateAsync() {
  const connection = yield select((state) => { return state.ws.connection; });
  try {
    connection.emitServerMessage({
      type: wsServerMessages.WS_SERVER_CHAT_SESSION_CREATE,
    });
  } catch (err) {
    yield put(actions.createSessionError(err));
  }
}

function* watchUserCreate() {
  yield takeEvery(constants.USER_CREATE, userCreateAsync);
}

function* userCreateAsync(action) {
  const connection = yield select((state) => { return state.ws.connection; });
  try {
    connection.emitServerMessage({
      type: wsServerMessages.WS_SERVER_CHAT_USER_ADD,
      token: action.payload.token,
      data: { user: action.payload.user },
    });
  } catch (err) {
    yield put(actions.createSessionError(err));
  }
}

function* watchMessageSend() {
  yield takeEvery(constants.MESSAGE_SEND, messageSendAsync);
}

function* messageSendAsync(action) {
  const connection = yield select((state) => { return state.ws.connection; });
  try {
    connection.emitServerMessage({
      type: wsServerMessages.WS_SERVER_CHAT_MESSAGE_SEND,
      token: action.payload.token,
      data: action.payload.data,
    });
  } catch (err) {
    yield put(actions.createSessionError(err));
  }
}

export default [
  watchSocketMessage(),
  watchSocketMessageError(),
  watchSessionGetAll(),
  watchSessionCreate(),
  watchUserCreate(),
  watchMessageSend(),
];
