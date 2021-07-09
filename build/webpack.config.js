const {resolve} = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');


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
        terserOptions: {
          ecma: 9,
          toplevel: true,
          output: {
            ascii_only: true
          },
        },
      }),
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: ['manifest.json'],
    }),
  ],
}
