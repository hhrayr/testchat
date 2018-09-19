import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';
import websocketMiddleware from './wsMiddleware';
import reducers from './index';
import rootSaga from '../sagas';

export default (history, preloadedState) => {
  const enhancers = [];
  if (process.env.NODE_ENV === 'local' && typeof window !== 'undefined') {
    const { devToolsExtension } = window;
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }
  }

  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    reducers,
    preloadedState,
    compose(
      applyMiddleware(
        routerMiddleware(history),
        sagaMiddleware,
        websocketMiddleware,
      ),
      ...enhancers,
    ),
  );

  sagaMiddleware.run(rootSaga);

  store.close = () => { store.dispatch(END); };
  return store;
};
