let path = require('path');
let webpack = require('webpack')
const autoprefixer = require('autoprefixer');

let conf = {
  entry: './source/main.js',
  output: {
    path: path.join(__dirname, '/output'),
    filename: 'main.js',
    publicPath: 'output/',
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
  devServer: {
    overlay: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: '/node_modules/',
      },
      {
        test: /\.(less|css)$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: [
              autoprefixer({
                browsers: ['ie >= 8', 'last 4 version'],
              }),
            ],
            sourceMap: true,
          },
        },
        {
          loader: 'less-loader',
        }],
      },
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              publicPath: 'images',
              name: '[name].[ext]',
              outputPath: 'images',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
      {
        test: require.resolve('snapsvg/dist/snap.svg.js'),
        use: 'imports-loader?this=>window,fix=>module.exports=0',
      },
    ],
  },
  resolve: {
    alias: {
      snapsvg: 'snapsvg/dist/snap.svg.js',
    },
  },
};

module.exports = (env, options) => {
  conf.devtool = options.mode === 'production'
    ? false : 'cheap-module-eval-source-map';
  return conf;
};
