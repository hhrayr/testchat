/* eslint-disable import/no-extraneous-dependencies, global-require, prefer-destructuring */
require('@babel/register');
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const fse = require('fs-extra');
const autoprefixer = require('autoprefixer');
const WebpackOnBuildPlugin = require('./utils/webpackPlugins').default;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function getEnvironmentVariables() {
  const env = Object.keys(process.env).reduce((resObj, key) => {
    const obj = resObj;
    if (!obj['process.env']) {
      obj['process.env'] = {};
    }
    obj['process.env'][key] = JSON.stringify(process.env[key]);
    return obj;
  }, {});

  return {
    ...env,
    'process.env': {
      ...env['process.env'],
      NODE_ENV: JSON.stringify('production'),
    },
  };
}

module.exports = (env, argv) => {
  const webpackConfig = {
    mode: 'production',
    resolve: {
      extensions: ['.js'],
    },
    entry: {
      main: [
        '@babel/polyfill',
        './client.js',
      ],
      vendor: [
        'core-js/modules/es6.symbol',
        'bowser',
        'es6-promise',
        'react',
        'react-transition-group',
        'react-dom',
        'react-router',
        'react-router-redux',
        'react-redux',
        'redux',
        'redux-saga',
      ],
    },
    output: {
      path: path.resolve(`./build/js/${argv.id}/`),
      publicPath: `/public/js/${argv.id}/`,
      filename: '[name].[chunkhash].js',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: Object.assign({}, argv.babelLoaderOptions, {
              babelrc: false,
            }),
          },
        },
        { test: /\.ttf$/, use: 'file-loader' },
        { test: /\.eot$/, use: 'file-loader' },
        { test: /\.svg$/, use: 'file-loader' },
        { test: /\.(png|jpg|jpeg|gif)/, use: 'url-loader' },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' }),
        },
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              {
                loader: 'csso-loader',
                options: {
                  restructure: false,
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => {
                    return [autoprefixer({ browsers: argv.browserQuery })];
                  },
                },
              },
              'sass-loader',
              {
                loader: 'sass-resources-loader',
                options: {
                  resources: [
                    'sass/base/base.scss',
                  ],
                },
              },
            ],
          }),
        },
      ],
    },
    node: {
      setImmediate: false,
      console: true,
      fs: 'empty',
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          parallel: true,
          uglifyOptions: {
            compress: true,
          },
        }),
      ],
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
          },
        },
      },
    },
    plugins: [
      new webpack.DefinePlugin(getEnvironmentVariables()),
      new ExtractTextPlugin({
        filename: '[name].style.css',
        allChunks: true,
      }),
      new ManifestPlugin(),
      new WebpackOnBuildPlugin({
        onFinish: () => {
          const manifest = require(`./build/js/${argv.id}/manifest.json`);
          manifest.build = (new Date().getTime());
          fse.outputFileSync(`./build/js/${argv.id}/manifest.json`, JSON.stringify(manifest));
        },
      }),
    ],
  };

  if (argv.report) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static',
    }));
  }


  return webpackConfig;
};
