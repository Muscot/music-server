import * as ws from './socket';
import express from 'express';
import runner from 'swagger-node-runner';
import timeout from 'connect-timeout';
import { SwaggerUIBundle, SwaggerUIStandalonePreset } from "swagger-ui-dist";
import {web as config} from './config';

const swaggerUiAssetPath = require("swagger-ui-dist").getAbsoluteFSPath();

var app = express();
module.exports = app; // for testing

runner.create({ appRoot: __dirname }, function(err, swaggerRunner) {
  if (err) { throw err; }

  app.use(timeout(config.timeout)); // 10 minute

  // install middleware
  ws.register(app);
  swaggerRunner.expressMiddleware().register(app);

  app.use('/', express.static('public'));
  app.use('/ui', express.static(swaggerUiAssetPath));
  app.use('/swagger', express.static('api/swagger/swagger.yaml'));
  
  ws.listen(app.listen(config.port));
});