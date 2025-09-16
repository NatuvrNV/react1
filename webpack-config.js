


const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      `...`, // Keep existing minimizers (like Terser)
      new CssMinimizerPlugin(),
    ],
  },
};



module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};

