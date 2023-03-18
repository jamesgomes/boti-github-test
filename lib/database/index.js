const logger = require('node-color-log');
const Db = require('./mongodb');

const dbInstance = new Db();
module.exports = {
  async close() {
    try {
      if (dbInstance) {
        logger.info('[MongoDB] Database trying to disconnect');
        await dbInstance.close();
      }
    } catch (e) {
      logger.error('Error on close DB: %j', e);
      throw e;
    }
  },
  async dropDatabase() {
    try {
      if (process.env.NODE_ENV === 'test') {
        if (dbInstance) {
          logger.info('[MongoDB] Database trying to drop.');
          const result = await dbInstance.dropDatabase();
          return result;
        }
        logger.warn('[MongoDB] Database instance not found.');
        return false;
      }
      logger.warn('[MongoDB] NODE_ENV development not found.');
      return false;
    } catch (e) {
      logger.error('Error on drop DB: %j', e);
      throw e;
    }
  },
  async connect(minPoolSize = 6) {
    try {
      const url = process.env.MONGODB_URI;
      if (!url) {
        const message = '[MongoDB] Database failed to connect - MONGODB_URI not found.';
        logger.error(message);
        throw new Error(message);
      }
      await dbInstance.connect(url, {
        minPoolSize,
      });
      logger.info('[MongoDB] Database connected');
      return true;
    } catch (e) {
      logger.error('[MongoDB] Database failed to connect - %s', e.message);
      throw e;
    }
  },
  getCollection(name) {
    return dbInstance.getCollection(name);
  },
  ObjectId: dbInstance.ObjectId,
};
