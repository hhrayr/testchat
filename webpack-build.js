/* eslint-disable no-console, import/no-extraneous-dependencies, import/first,
prefer-destructuring */
require('@babel/register');

const webpack = require('webpack');
const getConfig = require('./webpack.config.production');
const createManifest = require('./bundle-utils/manifest').createManifest;
const browsers = require('./bundle-utils/browsers').default;
const getBabelrcByBrowserQuery = require('./bundle-utils/babelrc').default;

function webpackBuild() {
  const manifest = createManifest();
  const configs = browsers.map((browserQuery) => {
    const babelLoaderOptions = getBabelrcByBrowserQuery(browserQuery);
    return getConfig(process.env.NODE_ENV, {
      browserQuery,
      babelLoaderOptions,
      id: manifest[browserQuery],
      report: process.argv.includes('--report'),
    });
  });

  webpack(configs, (err, stats) => {
    if (err && stats && stats.hasErrors()) {
      console.error(err, stats);
    }
  });
}

webpackBuild();
