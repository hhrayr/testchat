import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import Html from '../html/Html';
import App from '../../components/App';

export default (bundleId, location, store, context) => {
  const html = (
    <Html bundleId={bundleId} store={store} location={location} context={context}>
      <Provider store={store}>
        <StaticRouter location={location} context={context}>
          <App />
        </StaticRouter>
      </Provider>
    </Html>
  );
  return `<!DOCTYPE html>${renderToString(html)}`;
};
