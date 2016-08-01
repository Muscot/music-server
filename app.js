'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var timeout = require('connect-timeout');
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
  app.listen(port);
  app.use((req, res, next) => {
    if (!req.timedout) next();

    res.set('Content-Type', 'application/json');
    res.send({
        'status' : 500,
        'message' : "my timeout"
    });
  });
});
