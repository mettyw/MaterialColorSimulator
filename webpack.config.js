const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

module.exports = {
  entry: './src/js/main.js',
  mode: 'production',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 8080,
    hot: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/static', to: '.' },
     ],

    }),
  /*  new WebpackShellPluginNext({
      onBuildStart:{
        scripts: ['echo "Webpack Start"'],
        blocking: true,
        parallel: false
      }, 
      onBuildEnd:{
        scripts: [
          'echo "Webpack End"',
          // remove CSS reference for Inkscape only and optimize SVG
          'npx svgo dist/components.svg',
        ],
        blocking: true,
        parallel: false
      }
    }),*/

  ],
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: () => [
                  require('autoprefixer'),
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.svg$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
          {
            loader: 'svgo-loader',
          }
        ]
      },
      {
        test: /\.css$/,
        use: 'css-loader',
        exclude: /node_modules/
      }
    ],
  },
};
