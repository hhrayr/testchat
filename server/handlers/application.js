/* eslint-disable prefer-const */
import createMemoryHistory from 'history/createMemoryHistory';
import { matchPath } from 'react-router-dom';
import { getBrowserIdByUserAgent } from '../../bundle-utils/manifest';
import renderHtml from './renderHtml';
import routes from '../../routes';
import configureStore from '../../redux/configureStore';

const handleRenderError = (error) => {
  return `<!doctype html>Server Error: ${error}`;
};

export default (req, res) => {
  global.userAgent = req.header('User-Agent');
  let bundleId = '';
  if (process.env.NODE_ENV !== 'local') {
    bundleId = getBrowserIdByUserAgent(global.userAgent);
  }
  const history = createMemoryHistory({
    initialEntries: [req.originalUrl],
  });

  const store = configureStore(history);
  let match = null;
  routes.some((route) => {
    match = matchPath(req.originalUrl, route);
    if (match) {
      match.route = route;
      return true;
    }
    return false;
  });

  if (match) {
    try {
      let context = {};
      const html = renderHtml(bundleId, req.originalUrl, store, context);
      if (!context.url) {
        return res
          .status(200)
          .type('html')
          .send(html);
      }
      return res.redirect(301, context.url);
    } catch (err) {
      return res.status(500).send(handleRenderError(err));
    }
  }
  return res.status(404).send(handleRenderError(new Error('Page not found')));
};
