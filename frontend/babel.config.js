module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          'module-resolver',
          {
            alias: {
              "@assets": "./assets",
              "@components": "./components",
              "@constants": "./constants",
              "@hooks": "./hooks",
              "@screens": "./app/screens"
            },
            extensions: [".js", ".jsx", ".ts", ".tsx", ".json"]
          },
        ],
      ],
    };
  };
  
  