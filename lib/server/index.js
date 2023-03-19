const logger = require('node-color-log');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const pkg = require('../../package.json');
const bearerStrategy = require('../authorization');
const repositoresRoutes = require('../repositories/routes');
const swagger = require('../../swagger.json');

const server = (() => {
  const router = new express.Router();
  const app = express();
  const env = process.env.NODE_ENV;
  let serverProcess;
  const port = process.env.PORT || 3000;
  swagger.servers = [{
    url: process.env.SERVICE_URL,
  }];

  const start = () => new Promise((resolve) => {
    repositoresRoutes(router);
    bearerStrategy.init();

    app.set('port', port);
    app.use(helmet());
    app.use(cors());
    app.use(express.json({ limit: '500kb' }));
    app.use('/', router);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));

    serverProcess = app.listen(app.get('port'), () => {
      logger.info('------------------------------------------------------------------');
      logger.info(`${pkg.name} - Version: ${pkg.version}`);
      logger.info('------------------------------------------------------------------');
      logger.info(`ATTENTION, ${env} ENVIRONMENT!`);
      logger.info('------------------------------------------------------------------');
      logger.info(`Express server listening on port: ${serverProcess.address().port}`);
      logger.info('------------------------------------------------------------------');

      return resolve(app);
    });
  });

  const stop = () => new Promise((resolve, reject) => {
    if (serverProcess) {
      serverProcess.close((err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    }
  });

  return {
    start,
    stop,
  };
})();

module.exports = server;
