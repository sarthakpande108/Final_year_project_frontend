module.exports = {
    // Other configurations...
    module: {
      rules: [
        // Other rules...
        {
          test: /\.js$/,
          enforce: 'pre',
          loader: 'source-map-loader',
          exclude: [
            /node_modules\/jspdf\/dist\/jspdf.es.min\.js/,
          ],
        },
      ],
    },
    ignoreWarnings: [
      {
        module: /jspdf\/dist\/jspdf.es.min\.js/,
        message: /Failed to parse source map/,
      },
    ],
  };
  