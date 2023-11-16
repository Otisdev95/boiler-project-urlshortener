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

app.get('/api/shorturl/:shorturl', (res, req) => {
  const shorturl = (+req.params.shorturl);
  const foundIndex = shortUrls.indexOf(shorturl);

  if (foundIndex < 0) {
    return res.json({
      'error': 'No short URL ffound for the given input'
    });
  }
  res.redirect(originalUrls[foundIndex]);
});

// STEPS TO BUILD A URL SHORTENER
// 1. PASS IN express.json MIDDLEWARE TO HANDLE urlEncoded
//    app.use(express.urlEncoded({ extended: true }));
// 2. DECLARE A POST END-POINT
// 3. DECLARE originalUrls and shortUrls []
// 4. DECLARE url
// 5. DECLARE foundIndex OF originalUrls TO url
// 6. DECLARE ERROR MSG FOR WRONG URL
//    if (!url.includes('http://') && !url.includes('https://')) {
//      return res.json({ error: 'invalid url' });
//    }
// 7. 
// 8. PUSH originalUlrs TO url AND shortUrls TO shortUrls.length
// 9. RETURN A JSON RES of original_url: to url AND short_url to - 1.
//10. BUT IF FOUND, RETURN JSON RES OF original_url TO url AND
//    short_url TO shortUrls[foundIndex]
//11. DECLARE A GET END-POINT app.get('/api/shorturl/:shorturl')
//12. DECLARE shorturl (parseInt TO TURN IT INTO A NUMBER)
//13. DECLARE foundIndex OF shortUrls TO shorturl
//14. DECLARE IF STATEMENT IF foundIndex IS NOT FOUND
//15. RETURN JSON RES "error": "No short URL found for the given input"
//16. redirect THE RES TO THE originalUrls foundIndex

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
