const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  mode: "production", // ensure production optimizations
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false, // don’t generate LICENSE.txt
        terserOptions: {
          compress: {
            drop_console: true,   // remove console.log
            drop_debugger: true,  // remove debugger
          },
        },
      }),
      new CssMinimizerPlugin(),
    ],
    splitChunks: {
      chunks: "all",
      minSize: 20000, // Split bundles bigger than 20kb
      maxSize: 250000, // Ensure bundles aren’t too huge
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
    runtimeChunk: "single", // Extract runtime for better caching
  },
};
