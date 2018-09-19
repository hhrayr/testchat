import debug from 'debug';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import './sass/main.scss';
import configureStore from './redux/configureStore';
import App from './components/App';
import { connect } from './redux/ws/actions';

if (typeof document !== 'undefined') {
  ((mountNode) => {
    const debugClient = debug('testChat');
    const history = createBrowserHistory();
    const store = configureStore(history, window.App);

    store.dispatch(connect());

    window.React = ReactDOM;

    debugClient('React Rendering');

    ReactDOM.hydrate(
      <Provider store={store} key="provider">
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>,
      mountNode,
      () => {
        debugClient('React Rendered');
      },
    );
  })(document.body);
}
