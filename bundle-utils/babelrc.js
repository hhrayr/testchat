import { cloneDeep } from 'lodash';

const babelrc = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: 'defaults',
        },
        modules: false,
        useBuiltIns: 'usage',
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    'es6-promise',
    'lodash',
    ['module-resolver', {
      alias: {
        Redux: './redux',
        Sagas: './sagas',
        Components: './components',
        Routes: './routes',
        Utils: './utils',
      },
    }],
    'transform-flow-strip-types',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-function-bind',
    '@babel/plugin-transform-object-assign',
    '@babel/plugin-transform-modules-commonjs',
  ],
};

export default function getBabelrcByBrowserQuery(browserQuery) {
  const result = cloneDeep(babelrc);
  result.presets[0][1].targets.browsers = browserQuery;
  if (process.env.NODE_ENV !== 'production') {
    result.plugins.push('react-hot-loader/babel');
  }
  return result;
}
