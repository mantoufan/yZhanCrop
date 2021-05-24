const { resolve } = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/yzhancrop.js',
  output: {
    filename: 'yzhancrop.js',
    path: resolve('dist'),
    library: 'YZhanCrop',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'this',
    environment: {
      arrowFunction: false,
      bigIntLiteral: false,
      const: false,
      destructuring: false,
      dynamicImport: false,
      forOf: false,
      module: false
    }
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: resolve('src'),
      use: [
        'thread-loader',
        {
          loader: 'babel-loader?cacheDirectory',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-transform-runtime', { corejs: 3 }],
              '@babel/plugin-transform-modules-umd'
            ]
          }
        }
      ]
    }]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: resolve('src/static'),
          to: resolve('dist/static')
        }
      ]
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('src/index.html'),
      favicon: resolve('src/favicon.ico'),
      inject: 'head',
      scriptLoading: 'blocking'
    })
  ]
}
