module.exports = {
  env: {
    browser: true,
    es2021: true,
    jquery: true,
  },
  extends: 'airbnb-base',
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-plusplus': 'off',
  },
  plugins: [
    'eslint-plugin-html',
  ],
  ignorePatterns: [
    'webpack.config.js',
    'dist/*.js',
    'svg-inject.min.js',
  ],
};
