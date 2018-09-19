/* eslint-disable import/no-extraneous-dependencies */
require('@babel/register');

const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const getBabelrcByBrowserQuery = require('./bundle-utils/babelrc').default;

const basicEntry = [
  '@babel/polyfill',
  'webpack-dev-server/client?http://localhost:9090',
  'webpack/hot/only-dev-server',
];

const webpackConfig = {
  mode: 'development',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  entry: {
    main: [
      ...basicEntry,
      './client.js',
    ],
  },
  output: {
    path: path.resolve('./build/js'),
    publicPath: 'http://localhost:9090/public/js/',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: Object.assign({}, getBabelrcByBrowserQuery('last 3 chrome versions, last 3 safari versions'), {
            babelrc: false,
          }),
        },
      },
      { test: /\.ttf$/, use: 'file-loader' },
      { test: /\.woff$/, use: 'file-loader' },
      { test: /\.eot$/, use: 'file-loader' },
      { test: /\.svg$/, use: 'file-loader' },
      { test: /\.(png|jpg|jpeg|gif)/, use: 'url-loader' },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader?sourceMap',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => {
                return [autoprefixer({ browsers: ['> 1%', 'last 10 versions'] })];
              },
              sourceMap: true,
            },
          },
          'sass-loader?sourceMap',
          {
            loader: 'sass-resources-loader',
            options: {
              resources: [
                'sass/base/base.scss',
              ],
            },
          },
        ],
      },
    ],
  },
  node: {
    setImmediate: false,
    console: true,
    fs: 'empty',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
  devtool: 'source-map',
};

module.exports = webpackConfig;
