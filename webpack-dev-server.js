/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  contentBase: config.output.path,
  hot: true,
  historyApiFallback: true,
  proxy: {
    '**': { target: 'http://localhost:3002' },
  },
}).listen(9090, 'localhost', (err) => {
  if (err) {
    console.error(err);
  }
  console.log('Webpack Dev Server listening on port 9090');
});
