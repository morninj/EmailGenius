const WebpackShellPluginNext = require('webpack-shell-plugin-next');

const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    content: './ts/content.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build/js'),
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new WebpackShellPluginNext({
      onBuildEnd: {
        scripts: ['npm run reload'],
        blocking: true,
        parallel: false,
      },
    }),
  ],
};
