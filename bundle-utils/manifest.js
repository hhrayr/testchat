/* eslint-disable import/no-extraneous-dependencies, global-require */
import { matchesUA } from 'browserslist-useragent';
import md5 from 'md5';
import fs from 'fs-extra';
import path from 'path';
import browsers from './browsers';

export function createManifest() {
  const browserManifest = {};
  browsers.forEach((browser) => {
    browserManifest[browser] = md5(browser);
  });

  fs.outputFile(
    path.join(__dirname, '../build/browser-manifest.json'),
    JSON.stringify(browserManifest), (err) => {
      if (err) {
        console.error('Couldnt write browser-manifest.json', err);
      }
    },
  );

  return browserManifest;
}

function getManifest() {
  return require(path.join(__dirname, '../build/browser-manifest.json'));
}

export function getBrowserIdByUserAgent(userAgent) {
  const manifest = getManifest();

  let targetBrowser = Object.keys(manifest)[0];

  Object.keys(manifest).forEach((browser) => {
    const isTargetBrowser = matchesUA(userAgent, { browsers: browser.split(',') });
    if (isTargetBrowser) {
      targetBrowser = browser;
    }
  });

  return manifest[targetBrowser];
}
