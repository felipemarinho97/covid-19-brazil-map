const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const plugins = [];

if (process.env.ANALYZE == "true") {
  plugins.push(new BundleAnalyzerPlugin());
}

module.exports = {
  publicPath: "/",
  configureWebpack: {
    plugins
  }
};
