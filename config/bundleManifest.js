/* eslint-disable import/no-unresolved, no-undef, global-require */

import { getEnvironment } from '../utils/env';

const isLocal = getEnvironment() === 'local';

function getManifest(bundleId) {
  if (isLocal) {
    return { build: '', 'vendor.js': '' };
  }

  return require(`../build/js/${bundleId}/manifest.json`);
}

function resolveBundleFileUrl(fileName, bundleId) {
  const filePath = getManifest(bundleId)[fileName];
  const buildDate = getManifest(bundleId).build;
  if (isLocal) {
    return `/public/js/${fileName}`;
  }
  return `${filePath}?build=${buildDate}`;
}

export function getJsBundleFiles(bundleId) {
  const res = [];

  if (!isLocal) {
    res.push(resolveBundleFileUrl('vendor.js', bundleId));
    res.push(resolveBundleFileUrl('main.js', bundleId));
  } else {
    res.push(resolveBundleFileUrl('main.js', ''));
  }

  return res;
}

export function getCssBundleFiles(bundleId) {
  if (!isLocal) {
    return [
      resolveBundleFileUrl('main.css', bundleId),
      resolveBundleFileUrl('vendor.css', bundleId),
    ];
  }

  return null;
}
