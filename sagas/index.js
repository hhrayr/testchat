/* eslint-disable no-console */
import 'regenerator-runtime/runtime';
import { all } from 'redux-saga/effects';
import chatWatchers from './chat';

export default function* rootSaga() {
  try {
    const sagas = []
      .concat(chatWatchers);
    yield all(sagas);
  } catch (e) {
    console.log('rootSaga error:', e);
    throw e;
  }
}

