const logger = require('node-color-log');
const sha256 = require('sha256');
const getRepositoriesByLanguage = require('../../clients/gitHub');

const {
  CollectionName,
  insertMany,
  deleteMany,
  insertOne,
} = require('../../commons/repositoryDb');

const createUserApi = async () => {
  await deleteMany(CollectionName.AUTHTOKENS);
  try {
    const dataToken = {
      userId: 'grupoboticario',
      token: sha256('senha'),
    };

    await insertOne(CollectionName.AUTHTOKENS, dataToken);
  } catch (error) {
    logger.error(`Error creating api user. Error: ${error.message}`);
  }
};

const getRepositoriesAndSave = async () => {
  try {
    await deleteMany(CollectionName.REPOSITORES);
    logger.info('Searching repositories on GitHub');
    logger.info('------------------------------------------------------------------');
    const languages = process.env.GITHUB_LANGUAGES.split(', ');
    const { data, error } = await getRepositoriesByLanguage(
      languages,
      process.env.GITHUB_LIMIT_ITEMS,
    );

    if (!error && data.length) {
      logger.info(`${data.length} repositories found on GitHub`);
      logger.info('------------------------------------------------------------------');
      await insertMany(CollectionName.REPOSITORES, data);
      logger.info('Repositories successfully saved');
      return;
    }
    logger.info('No repository found on GitHub');
    logger.info('------------------------------------------------------------------');
    return;
  } catch (error) {
    logger.error(`Error fetching repositories. Error: ${error.message}`);
  }
};

module.exports = {
  createUserApi,
  getRepositoriesAndSave,
};
