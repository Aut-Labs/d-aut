/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
const { alias } = require('react-app-rewire-alias');

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
  webpack: (configuration) => {
    const production = configuration.mode === 'production';
    if (production) {
      configuration = prodUtils.lib(configuration);
    } else {
      configuration = devUtils.lib(configuration);
      configuration = devUtils.aliases(configuration);
    }
    return configuration;
  },
  paths(paths, env) {
    const production = env === 'production';
    if (production) {
      paths = prodUtils.paths(paths, env);
    }
    return paths;
  },
};
