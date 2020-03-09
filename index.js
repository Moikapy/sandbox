const cacheableResponse = require('cacheable-response');

const cors = require('cors');
const express = require('express');
const next = require('next');

let app;

const PORT = parseInt(process.env.PORT, 10) || 3030;

//////////////////////////////////////////
const ssrCache = cacheableResponse({
  ttl: 1000 * 60 * 60, // 1hour
  get: async ({ req, res, pagePath, queryParams }) => ({
    data: await app.renderToHTML(req, res, pagePath, queryParams),
  }),
  send: ({ data, res }) => res.send(data),
});

const dev = process.env.NODE_ENV !== 'production';

app = next({ dev });

let server = express();
const handle = app.getRequestHandler();
server.use(cors({ origin: 'localhost:7878' }));
app.prepare().then(() => {
  /**
   * Gets Root Path for Testing
   * @param {object} req - What can be requested
   * @param {object} res - What the Get Responds with
   * @returns {undefined} - Returns "IDD-API" res.status(200)
   */
  // Route to use

  const handle = app.getRequestHandler();
  server.get(
    '/',
    async (req, res) => await ssrCache({ req, res, pagePath: '/' })
  );

  server.all('*', (req, res) => handle(req, res));

  server.listen(PORT, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
