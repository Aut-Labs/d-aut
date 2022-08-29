/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const { alias } = require('react-app-rewire-alias');
const webpack = require('webpack');

const COMMON_JS = process.env.BUILD_CJS === 'true';

const prodUtils = {
  lib: (config) => {
    config.entry = './src/index.tsx';
    config.output.filename = 'index.js';
    if (COMMON_JS) {
      config.output.libraryTarget = 'commonjs';
    } else {
      config.output.libraryTarget = 'umd';
      config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;
      config.output.umdNamedDefine = true;
    }
    config.plugins = config.plugins.filter(
      (p) =>
        p.constructor.name !== 'HtmlWebpackPlugin' &&
        p.constructor.name !== 'ManifestPlugin' &&
        p.constructor.name !== 'MiniCssExtractPlugin'
    );
    delete config.optimization;
    return config;
  },
  paths: (paths) => {
    const dir = COMMON_JS ? 'cjs' : 'ems';
    paths.appBuild = path.resolve(__dirname, `build/${dir}`);
    return paths;
  },
};

const devUtils = {
  lib: (config) => {
    config.entry = './src/dev.index.tsx';
    return config;
  },
  aliases: (config) => {
    return alias({
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      '@mui/material': path.resolve('./node_modules/@mui/material'),
      '@mui/icons-material': path.resolve('./node_modules/@mui/icons-material'),
      '@emotion/react': path.resolve('./node_modules/@emotion/react'),
      '@emotion/styled': path.resolve('./node_modules/@emotion/styled'),
      'react-router-dom': path.resolve('./node_modules/react-router-dom'),
    })(config);
  },
};

module.exports = {
  webpack: (config) => {
    const production = config.mode === 'production';
    if (production) {
      config = prodUtils.lib(config);
    } else {
      config = devUtils.lib(config);
      config = devUtils.aliases(config);
    }
    // const fallback = config.resolve.fallback || {};
    // Object.assign(fallback, {
    //   crypto: require.resolve('crypto-browserify'),
    //   stream: require.resolve('stream-browserify'),
    //   assert: require.resolve('assert'),
    //   http: require.resolve('stream-http'),
    //   https: require.resolve('https-browserify'),
    //   os: require.resolve('os-browserify'),
    //   url: require.resolve('url'),
    // });
    // config.resolve.fallback = fallback;
    // config.plugins = (config.plugins || []).concat([
    //   new webpack.ProvidePlugin({
    //     Buffer: ['buffer', 'Buffer'],
    //   }),
    // ]);

    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      assert: require.resolve('assert'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      os: require.resolve('os-browserify'),
      url: require.resolve('url'),
    });
    config.ignoreWarnings = [/Failed to parse source map/];
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
      new webpack.ProvidePlugin({
        process: 'process/browser',
        Buffer: ['buffer', 'Buffer'],
      }),
    ]);
    config.module.rules.unshift({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false, // disable the behaviour
      },
    });
    return config;
  },
  paths(paths, env) {
    const production = env === 'production';
    if (production) {
      paths = prodUtils.paths(paths, env);
    }
    return paths;
  },
};
