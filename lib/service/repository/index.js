const logger = require('node-color-log');
const getRepositoriesByLanguage = require('../../clients/gitHub');
const { CollectionName, insertMany } = require('../../commons/repositoryDb');

const getRepositoriesAndSave = async () => {
  try {
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

module.exports = getRepositoriesAndSave;
