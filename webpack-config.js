const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const glob = require("glob");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production", // enables many optimizations by default
  entry: "./src/index.js",
  output: {
    filename: "[name].[contenthash].js", // cache-busting
    path: path.resolve(__dirname, "dist"),
    clean: true, // cleans /dist folder automatically
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"], // for modern JS support
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin(), // cleans old builds
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css", // cache-busting CSS
    }),
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, "src")}/**/*`, { nodir: true }),
      safelist: () => ({
        standard: [/^navbar/, /^modal/], // keep dynamic classes (Bootstrap/Tailwind, etc.)
      }),
    }),
  ],

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: true, // remove console.log in production
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: "all", // better caching
    },
    runtimeChunk: "single", // separates runtime for long-term caching
  },
};
