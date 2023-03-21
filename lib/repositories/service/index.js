const logger = require('node-color-log');
const repositoryDb = require('../../commons/repositoryDb');
const getRepositoriesByLanguages = require('../../clients/gitHub');

const collectionName = repositoryDb.CollectionName.REPOSITORIES;

const getRepositoriesAndSave = async (page = 1) => {
  try {
    logger.info(`Searching repositories on GitHub - Page: ${page}`);
    logger.info('------------------------------------------------------------------');
    const languages = process.env.GITHUB_LANGUAGES.split(', ');
    const { data, error } = await getRepositoriesByLanguages(
      languages,
      page,
    );

    if (!error && data.items.length) {
      await repositoryDb.insertMany(repositoryDb.CollectionName.REPOSITORIES, data.items);
      if (data.nextPage > 0) {
        await getRepositoriesAndSave(data.nextPage);
      }
    }
  } catch (error) {
    logger.error(`Error fetching repositories. Error: ${error.message}`);
  }
};

const getRepositoriesBayId = async (id) => {
  try {
    const data = await repositoryDb.findById(collectionName, id);
    return { data };
  } catch (error) {
    return { error };
  }
};

const getRepositoriesByQuery = async (query = {}) => {
  try {
    const data = await repositoryDb.find(
      repositoryDb.CollectionName.REPOSITORIES,
      query,
      {},
      { stargazers_count: 1.0 },
      {},
    );
    return { data };
  } catch (error) {
    return { error };
  }
};

module.exports = {
  getRepositoriesBayId,
  getRepositoriesByQuery,
  getRepositoriesAndSave,
};
