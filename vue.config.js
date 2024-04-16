const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: process.env.VUE_APP_PORT || 8080, // Default port is 8080, change if necessary
    client: {
      overlay: {
        warnings: false,
        runtimeErrors: (error) => {
          const ignoreErrors = [
            "ResizeObserver loop limit exceeded",
            "ResizeObserver loop completed with undelivered notifications.",
          ];
          if (ignoreErrors.includes(error.message)) {
            return false;
          }
        },
      },
    },
  },
  publicPath: './', // Ensure resources are loaded correctly in Electron
  outputDir: 'dist' // Ensure the build output directory is 'dist'
});
