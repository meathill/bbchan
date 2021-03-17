const {resolve} = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    content: './src/content.js',
    background: './src/background.js',
  },
  output: {
    filename: '[name].js',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../src'),
    },
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        terserOptions: {
          ecma: 9,
          topLevel: true,
          output: {
            ascii_only: true
          },
        },
      }),
    ],
  },
}
