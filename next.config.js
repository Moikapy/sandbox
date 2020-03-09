const withOffline = require('next-offline');
const withCSS = require('@zeit/next-css');
const { parsed: localEnv } = require('dotenv').config();
const webpack = require('webpack');
// const withOffline = require('next-offline');

const nextConfig = withCSS({
  target: 'server',
  transformManifest: manifest => ['/'].concat(manifest), // add the homepage to the cache
  // Trying to set NODE_ENV=production when running yarn dev causes a build-time error so we
  // turn on the SW in dev mode so that we can actually test it
  devSwSrc: '/public/service-worker.js',
  generateInDevMode: true,
  workboxOpts: {
    maximumFileSizeToCacheInBytes: 5000000,
    // ...other Workbox build configuration options...
    swDest: 'static/service-worker.js',
    runtimeCaching: [
      {
        urlPattern: /.otf$/,
        handler: 'CacheFirst',
      },
      {
        urlPattern: /.js$/,
        handler: 'CacheFirst',
      },
      {
        urlPattern: /.css$/,
        handler: 'CacheFirst',
      },
      {
        urlPattern: /.png$/,
        handler: 'CacheFirst',
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
  publicRuntimeConfig: {
    mongoURI: process.env.mongoURI,
    PORT: process.env.PORT,
    SECRETKEY: process.env.SECRETKEY,
  },
  webpackDevMiddleware: config => {
    // Solve compiling problem via vagrant
    config.watchOptions = {
      poll: 800, // Check for changes every second
      aggregateTimeout: 300, // delay before rebuilding
    };
    return config;
  },
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv));
    return config;
  },
});

module.exports = withOffline(nextConfig);
