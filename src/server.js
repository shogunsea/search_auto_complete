const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();

const publicPath = path.resolve(__dirname, '../public');

const oneWeekInMsFormat = '7d';
const httpCachingOptions = {
  maxAge: oneWeekInMsFormat,
};

app.use(compression());
app.use(express.static(publicPath, httpCachingOptions));

app.get('/', function(req, res) {
  const indexFile = path.join(__dirname, './index.html');
  res.sendFile(indexFile);
});

const port = 3080;

app.listen(port, function() {
  console.log('yoooo!');
  console.log('Demo page running on http://localhost:' + port);
});
