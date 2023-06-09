require('dotenv').config();
const logger = require('node-color-log');
const server = require('./lib/server');
const database = require('./lib/database');
const { createUserApi } = require('./lib/authorization/services');
const { getRepositoriesAndSave } = require('./lib/repositories/service');

const shutdown = async () => {
  logger.info('Gracefully shutdown in progress');
  await server.stop();
  await database.close();
  process.exit(0);
};

process.on('SIGTERM', shutdown)
  .on('SIGINT', shutdown)
  .on('SIGHUP', shutdown)
  .on('uncaughtException', (err) => {
    logger.error('uncaughtException caught the error: ', err);
    throw err;
  })
  .on('unhandledRejection', (err, promise) => {
    logger.error(`Unhandled Rejection at: Promise ${promise} reason: ${err}`);
    throw err;
  })
  .on('exit', (code) => {
    logger.info(`Node process exit with code: ${code}`);
  });

const clearDataBase = async () => {
  try {
    await database.getCollection('oauthtokens').deleteMany();
    await database.getCollection('repositories').deleteMany();
  } catch (error) {
    logger.error('[APP] clear data base failed', error);
  }
};

(async () => {
  try {
    await database.connect();
    await clearDataBase();
    logger.info('------------------------------------------------------------------');
    await createUserApi();
    await getRepositoriesAndSave();
    await server.start();
  } catch (err) {
    logger.error('[APP] initialization failed', err);
    throw err;
  }
  logger.info('[APP] initialized SUCCESSFULLY');
})();
