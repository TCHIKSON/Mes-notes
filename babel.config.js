module.exports = function buildBabelConfig(api) {
  api.cache(true);

  return {
    presets: ["babel-preset-expo"]
  };
};
