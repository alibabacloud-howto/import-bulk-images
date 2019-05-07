'use strict';
const OSS = require('ali-oss');
const express = require('express');
const bodyParser = require('body-parser');

/* Settings */

// express settings
const app = express();
app.use('/', express.static('static/dist'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// alibaba cloud settings container
let ossClient = null;


/* Route */

// health check
app.get('/api/system/health', (req, res) => {
  res.send('OK!');
});

// index
app.get('/', (req, res) => {
  app.set('view engine', 'ejs');
  app.engine('html', require('ejs').renderFile);
  res.render('index.html');
});

// check if alibaba cloud settings is configured and return setting params
app.get('/api/setting', (req, res) => {
  if (!ossClient) {
    const error = 'no settings';
    res.send({ error });
    return;
  }

  // console.log(ossClient.options);
  const params = {
    region: ossClient.options.region,
    accessKeyId: ossClient.options.accessKeyId,
    accessKeySecret: ossClient.options.accessKeySecret,
    bucket: ossClient.options.bucket,
  };
  res.send(JSON.stringify(params));
});

// reset alibaba cloud settings
app.get('/api/setting/reset', (req, res) => {
  ossClient = null;
  const msg = 'Reset complete!';
  res.send(JSON.stringify({msg}));
});

// set alibaba cloud settings, fetch oss bucket image objects and send them
app.post('/api/oss/bucket', (req, res) => {
  // console.log(req.body);
  const region = req.body.region;
  const accessKeyId = req.body.accessKeyId;
  const accessKeySecret = req.body.accessKeySecret;
  const bucket = req.body.bucket;

  // validation
  if (!region || !accessKeyId || !accessKeySecret || !bucket) {
    const error = 'invalid request parameter';
    res.status(400).send({ error });
    return;
  }

  // settings
  ossClient = new OSS({ region, accessKeyId, accessKeySecret });
  ossClient.useBucket(bucket);
  // console.log(ossClient.options);

  // fetch bucket image objects
  ossClient.list()
  .then((json) => {
    if (!json.objects) return [];
    // console.log(json.objects);

    const imageExtension = /(png|jpg|jpeg)$/;
    const delimiter = '/';
    return json.objects
      .filter(o => o.name.match(imageExtension))
      .map((o) => {
        const name = `${delimiter}${o.name}`.split(delimiter).pop();
        const url = o.url;
        return { name, url };
      });
  })
  // return bucket image objects
  .then((json) => {
    // console.log(json);
    res.send(JSON.stringify(json));
  })
  .catch(() => {
    const error = 'request failed (request parameter must be wrong)';
    res.status(400).send({ error });
  });
});


/* run Express */

app.listen(3000);
console.log('Server running at http://localhost:3000');
