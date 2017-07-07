var path = require('path');
var webpack = require('webpack');

module.exports = {
  
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    // path: path.join(__dirname, 'dist'),
    // filename: 'bundle.js',
    // publicPath: '/sr/'
    filename:"bundle.js"
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),

    new webpack.IgnorePlugin(/\.(css|less)$/)
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel-loader'],
      include: path.join(__dirname, 'src')
    }],
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          'babel-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "less-loader", options: {
            strictMath: true,
            noIeCompat: true
          }
        }]
      }
    ]
  }
};
