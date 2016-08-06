'use strict';

var express = require('express');
var SwaggerExpress = require('swagger-express-mw');
var timeout = require('connect-timeout');

var app = express();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  app.use(timeout(10 * 60 * 1000)); // 10 minute

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;

  app.use('/', express.static('public'));
  app.listen(port);
});
