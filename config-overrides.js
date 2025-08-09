
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");

module.exports = function override(config) {
  // 1. Fallbacks para librerías de Node en el navegador
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    assert: require.resolve("assert"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    os: require.resolve("os-browserify"),
    url: require.resolve("url"),
    "process/browser": require.resolve("process/browser")
  });
  config.resolve.fallback = fallback;

  // 2. Plugins extra
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"]
    })
  ]);

  // 3. Evitar warnings de source-map-loader en ciertas librerías
  const oneOfRule = config.module.rules.find((rule) => Array.isArray(rule.oneOf));
  if (oneOfRule) {
    oneOfRule.oneOf.forEach((rule) => {
      if (String(rule.loader).includes("source-map-loader")) {
        rule.exclude = [...(rule.exclude || []), /node_modules\/@metamask\/utils/, /node_modules\/superstruct/];
      }
    });
  }

  return config;
};