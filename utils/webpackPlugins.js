/* eslint-disable import/no-extraneous-dependencies */
import type Compiler from 'webpack/lib/Compiler';

export default class WebpackOnBuildPlugin {
  constructor(options) {
    this.onFinish = options.onFinish;
    this.onStart = options.onStart;
  }
  apply(compiler: Compiler) {
    compiler.plugin('done', this.onFinish ? this.onFinish : () => {});
    compiler.plugin('compilation', this.onStart ? this.onStart : () => {});
  }
}
