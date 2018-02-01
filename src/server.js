const express = require('express');
const path = require('path');
const compression = require('compression');

const app = express();

const bootTwitterClient = require('./twitterClient');

const publicPath = path.resolve(__dirname, '../public');

const oneWeekInMsFormat = '7d';
const httpCachingOptions = {
  maxAge: oneWeekInMsFormat,
};

app.use(compression());
app.use(express.static(publicPath, httpCachingOptions));
bootTwitterClient(app);

app.get('/playground/search_auto_complete', function(req, res) {
  const indexFile = path.join(__dirname, './index.html');
  res.sendFile(indexFile);
});

const PORT = process.env.NODE_PORT || 8083;

app.listen(PORT, function() {
  console.log('yoooo!');
  console.log('Search auto complete running on http://localhost:' + PORT + '/playground/search_auto_complete');
});
