import * as constants from './constants';

export const getAllSessions = () => {
  return { type: constants.SESSION_GET_ALL };
};

export const getAllSessionsSuccess = (payload) => {
  return { type: constants.SESSION_GET_ALL_SUCCESS, payload };
};

export const getAllSessionsError = (payload) => {
  return { type: constants.SESSION_GET_ALL_ERROR, payload };
};

export const createSession = () => {
  return { type: constants.SESSION_CREATE };
};

export const createSessionSuccess = (payload) => {
  return { type: constants.SESSION_CREATE_SUCCESS, payload };
};

export const createSessionError = (payload) => {
  return { type: constants.SESSION_CREATE_ERROR, payload };
};

export const createChat = (payload) => {
  return { type: constants.CHAT_CREATE, payload };
};

export const createUser = (payload) => {
  return { type: constants.USER_CREATE, payload };
};

export const createUserSuccess = (payload) => {
  return { type: constants.USER_CREATE_SUCCESS, payload };
};

export const createUserError = (payload) => {
  return { type: constants.USER_CREATE_ERROR, payload };
};

export const createUserReset = (payload) => {
  return { type: constants.USER_CREATE_RESET, payload };
};

export const sendMessage = (payload) => {
  return { type: constants.MESSAGE_SEND, payload };
};

export const sendMessageSuccess = (payload) => {
  return { type: constants.MESSAGE_SEND_SUCCESS, payload };
};
