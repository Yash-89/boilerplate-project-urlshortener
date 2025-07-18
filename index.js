require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Database
let idToUrl = {};
let urlToId = {};
let count = 1;

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// app.post("/api/shorturl", (req, res) => {
//   const og_url = req.body.url;
//   let short_url;

//   const urlFormatRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}.*$/;

//   if (!urlFormatRegex.test(og_url)) {
//     return res.json({ error: 'invalid url' });
//   }
  
//   const parsedUrl = urlParser.parse(og_url);
//   dns.lookup(parsedUrl.hostname, (err, address) => {
//     if (err) {
//       // return res.json({ error: 'Invalid Hostname' });
//       return res.json({ error: 'invalid url' });
//     } else {
//       if (!idToUrl[og_url]) {
//         short_url = count++;
//         urlToId[og_url] = short_url;
//         idToUrl[short_url] = og_url;
//       }
//       else
//         short_url = urlToId[og_url];

//       res.json({
//         original_url: og_url,
//         short_url: short_url
//       })
//     }
//   });
// });

app.get("/api/shorturl/:id", (req, res) => {
  const id = req.params.id;
  const og_url = idToUrl[id];

  if (!og_url)
    res.json({ error: "No short URL found for given input" });
  else
    res.redirect(og_url);
})

app.post("/api/shorturl", (req, res) => {
  const og_url = req.body.url;
  let short_url;
  
  const dns = require('dns');
  const urlParser = require('url');
  const parsedUrl = urlParser.parse(og_url);

  dns.lookup(parsedUrl.hostname, (err, address) => {
    if (!address) {
      res.json({ error: 'invalid url' });
    } else {
      if (!idToUrl[og_url]) {
        short_url = count++;
        urlToId[og_url] = short_url;
        idToUrl[short_url] = og_url;
      }
      else
        short_url = urlToId[og_url];

      res.json({
        original_url: og_url,
        short_url: short_url
      })
    }
  });
});

app.get("/api/shorturl/:id", (req, res) => {
  const id = req.params.id;
  const og_url = idToUrl[parseInt(id)];

  if (!og_url)
    res.json({ error: "No short URL found for given input" });
  else
    res.redirect(og_url);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
