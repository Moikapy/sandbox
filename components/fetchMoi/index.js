const https = require('https');
const http = require('http');

export default function fetchMoi(url, options = {}) {
  return new Promise((resolve, reject) => {
    if (!url) return reject(new Error('Url is required'));

    const { body, method = 'GET', ...restOptions } = options;
    const client = url.startsWith('https') ? https : http;

    const request = client.request(url, { method, ...restOptions }, res => {
      let chunks = '';

      res.setEncoding('utf8');

      res.on('data', chunk => {
        chunks += chunk;
      });

      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: chunks });
      });
    });

    request.on('error', err => {
      reject(err);
    });

    if (body) {
      request.setHeader('Content-Length', body.length);
      request.write(body);
    }

    request.end();
  });
}
