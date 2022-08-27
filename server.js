// # self signed certs:
// openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./selfsigned.key -out selfsigned.crt
const express = require('express');
//const cors = require('cors');
const fs = require('fs');
const path = require('path');
const http = require('http');
const app = express();

const USE_HTTPS = true;

const HTTPS_HOST = "localhost";
const HTTPS_PORT = process.env.PORT || 8000;
const HTTP_HOST = HTTPS_HOST;
const HTTP_PORT = Number(HTTPS_PORT) + 1;
// directory to serve
const staticContentDirectory = path.join(__dirname, '/');
app.use(express.static(staticContentDirectory));

if (USE_HTTPS) {
  const https = require('https');
const key = fs.readFileSync(path.join(__dirname, 'selfsigned.key'));
const cert = fs.readFileSync(path.join(__dirname, 'selfsigned.crt'));
const options = {
  key: key,
  cert: cert
};
const httpsServer = https.createServer(options, app);
httpsServer.listen(HTTPS_PORT, HTTPS_HOST, () => console.log('HTTPS server started at https://' + httpsServer.address().address +':' + httpsServer.address().port))
  process.once('SIGINT', () => {
    httpsServer.close();
  });
}
const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, HTTP_HOST, () => console.log('HTTP server started at http://' + httpServer.address().address +':' + httpServer.address().port))
process.once('SIGINT', () => {
  httpServer.close();
});

