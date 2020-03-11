const withPWA = require('next-pwa');

module.exports = withPWA({
  pwa: {
    dest: 'public',
    disable: false,
    scope: '/',
    sw: 'service-worker.js',
    runtimeCaching: [
      {
        // Match any request that ends with .png, .jpg, .jpeg or .svg.
        urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

        // Apply a cache-first strategy.
        handler: 'CacheFirst',

        options: {
          // Use a custom cache name.
          cacheName: 'images',

          // Only cache 10 images.
          expiration: {
            maxEntries: 10,
          },
        },
      },
      {
        urlPattern: /^https?.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'offlineCache',
          networkTimeoutSeconds: 30,
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 1 month
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
  webpackDevMiddleware: config => {
    // Solve compiling problem via vagrant
    config.watchOptions = {
      poll: 800, // Check for changes every second
      aggregateTimeout: 300, // delay before rebuilding
    };
    return config;
  },
});
