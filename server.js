'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const path = require('path');
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
//Probe every 5th second
collectDefaultMetrics({timeout: 5000});

const counter = new client.Counter({
  name: 'node_request_operations_total',
  help: 'The total number of processed requests'
});

const histogram = new client.Histogram({
  name: 'node_request_duration_seconds',
  help: 'Histogram for the duration in seconds.',
  buckets: [1, 2, 5, 6, 10]
});

// App
// const app = express();
// app.get('/', (req, res) => {
//   res.send('Hello PRO690\n');
// });
const app = express();

app.get('/', function(req, res) {

    //simulate a sleep
    var start = new Date()
    var simulateTime = 1000

    setTimeout(function(argument){
      //execution time simlated with setTimeout function
      var end= new Date() - start
      histogram.observe(end/1000); //convert to seconds
    }, simulateTime)

    counter.inc();

  res.sendFile(path.join(__dirname, '/index.html'));
});



//metrics endpoint
app.get('/metrics',(req, res) => {
  res.set('Content-Type', client.register.contentType)
  res.end(client.register.metrics())
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);