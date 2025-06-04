const { override, addWebpackPlugin, ignoreWarnings } = require('customize-cra');
const WebpackSourceMapDevToolPlugin = require('webpack/lib/source-map-dev-tool-plugin');

module.exports = override(
  addWebpackPlugin(new WebpackSourceMapDevToolPlugin({
    exclude: [/jspdf\/dist\/jspdf.es.min\.js$/],
  })),
  ignoreWarnings([
    {
      module: /jspdf\/dist\/jspdf.es.min\.js/,
      message: /Failed to parse source map/,
    },
  ])
);
