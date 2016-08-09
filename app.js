'use strict';
import DebugLib from 'debug';

var ws = require('./socket');
var express = require('express');
var SwaggerExpress = require('swagger-express-mw');
var timeout = require('connect-timeout');

var debug = DebugLib('web');
var app = express();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  app.use(timeout(10 * 60 * 1000)); // 10 minute
  app.use(function (req, res, next) {
    debug(req.method + " " + req.url);
    next();
  });

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;

  app.use('/', express.static('public'));
  ws.createServer(app.listen(port));
});
