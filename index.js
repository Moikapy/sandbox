/**
 * Node Imports
 */
const { parse } = require('url');
const { join } = require('path');
const cors = require('cors');
const express = require('express');
const next = require('next');
const cacheableResponse = require('cacheable-response');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const siofu = require('socketio-file-upload');

let nextjs;

const sio = require('./components/sio');

const dev = process.env.NODE_ENV !== 'production';
const PORT = parseInt(process.env.PORT, 10) || 3030;

nextjs = next({ dev });

//////////////////////////////////////////
const ssrCache = cacheableResponse({
  ttl: 1000 * 60 * 60, // 1hour
  get: async ({ req, res, pagePath, queryParams }) => ({
    data: await nextjs.renderToHTML(req, res, pagePath, queryParams),
  }),
  send: ({ data, res }) => res.send(data),
});
const handle = nextjs.getRequestHandler();
nextjs.prepare().then(() => {
  app.use(cors({ origin: 'localhost:7878' }));
  app.use(siofu.router);
  /**
   * Gets Root Path for Testing
   * @param {object} req - What can be requested
   * @param {object} res - What the Get Responds with
   * @returns {undefined} - Returns "IDD-API" res.status(200)
   */
  // console.log(app);
  // Route to use
  sio(io, siofu);
  app.get('/service-worker.js', (req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    const filePath = join(
      `${__dirname}/../../../../../../../`,
      '.next/static/',
      pathname
    );
    // app.serveStatic(req, res, filePath);
    console.log(filePath);
    ssrCache({
      req,
      res,
      pagePath: filePath,
    });
  });
  app.get('/', async (req, res) => await ssrCache({ req, res, pagePath: '/' }));
  /**
   * Enables serviceworker
   */

  app.all('*', (req, res) => handle(req, res));

  http.listen(PORT, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
