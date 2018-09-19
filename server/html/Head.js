/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

import { getCssBundleFiles } from '../../config/bundleManifest';

class Head extends React.PureComponent {
  static propTypes = {
    env: PropTypes.string.isRequired,
    bundleId: PropTypes.string.isRequired,
  };

  renderJsVariablesScriptTag() {
    return (
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV='${this.props.env}';`,
        }}
      />
    );
  }

  renderCssBundles() {
    const cssFiles = getCssBundleFiles(this.props.bundleId);
    if (cssFiles) {
      return cssFiles.map((cssFile) => {
        return <link key={cssFile} rel="stylesheet" type="text/css" href={cssFile} />;
      });
    }
    return null;
  }

  renderPageTitle() {
    return <title>Test</title>;
  }

  render() {
    return (
      <head>
        {this.renderPageTitle()}
        <meta charSet="utf-8" />
        <meta content="noindex" name="robots" />
        <meta content="noindex" name="googlebot" />
        <meta
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
          name="viewport"
        />
        {this.renderCssBundles()}
        {this.renderJsVariablesScriptTag()}
      </head>
    );
  }
}

export default Head;
