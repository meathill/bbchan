const { DefinePlugin } = require('webpack');

module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'BB 酱',
    },
  },
  lintOnSave: false,
  chainWebpack(config) {
    config.plugin('define')
      .use(DefinePlugin, [
        {
          isDev: process.env.NODE_ENV === 'development',
        },
      ]);
  },
  devServer: {
    proxy: {
      '^/wallpaper': {
        target: 'https://www.bing.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/wallpaper': '',
        },
      },
    },
  },
};
