/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const { sync } = require('glob');

sync('./node_modules/@emotion/cache/package.json').forEach((src) => {
  const package = JSON.parse(fs.readFileSync(src, 'utf-8'));
  const { browser } = package;
  delete package.browser;
  if (browser) {
    package._browser = browser;
  }
  package.exports = {
    '.': {
      module: {
        worker: './dist/emotion-cache.worker.esm.js',
        default: './dist/emotion-cache.esm.js',
      },
      default: './dist/emotion-cache.cjs.js',
    },
    './package.json': './package.json',
  };

  fs.writeFileSync(src, JSON.stringify(package, null, 2));
});
