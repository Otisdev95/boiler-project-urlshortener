require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// This endpoint handles a POST request to /api/shorturl.
// It extracts the URL from the request body (req.body.url).
// Checks if the URL is valid (starts with 'https://' or 'http://').
// If not, it returns a JSON response with an error message.
// Checks if the URL is already in the originalUrls array. If not, it
// adds the URL to originalUrls and assigns a corresponding short URL
// index to it in shortUrls. It then returns a JSON response with the
// original and short URLs.
// If the URL is already in the originalUrls, it returns a JSON response
// with the original and corresponding short URL.

const originalUrls = [];
const shortUrls = [];

app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;
  const foundIndex = originalUrls.indexOf(url);

  if (!url.includes('https://') && !url.includes('http://')) {
    return res.json({ error: 'invalid url' });
  };

  if (foundIndex < 0) {
    originalUrls.push(url)
    shortUrls.push(shortUrls.length)

    return res.json({
      original_url: url,
      short_url: shortUrls.length - 1
    });
  }

  return res.json({
    original_url: url,
    short_url: shortUrls[foundIndex]
  });
});

// This endpoint handles a GET request to /api/shorturl/:shorturl.
// It extracts the short URL index from the request
// parameters (req.params.shorturl).
// Checks if the short URL index is in the shortUrls array.
// If not, it returns a JSON response with an error message.
// If the short URL index is found, it redirects the user to
// the corresponding original URL.

app.get('/api/shorturl/:shorturl', (req, res) => {
  const shorturl = parseInt(req.params.shorturl);
  const foundIndex = shortUrls.indexOf(shorturl);

  if (foundIndex < 0) {
    return res.json({
      'error': 'No short URL found for the given input'
    });
  }

  res.redirect(originalUrls[foundIndex]);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
