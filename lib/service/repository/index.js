const logger = require('node-color-log');
const sha256 = require('sha256');
const getRepositoriesByLanguages = require('../../clients/gitHub');

const repositoryDb = require('../../commons/repositoryDb');

const createUserApi = async () => {
  await repositoryDb.deleteMany(repositoryDb.CollectionName.AUTHTOKENS);
  try {
    const dataToken = {
      userId: 'grupoboticario',
      token: sha256(process.env.API_DEFAULT_PASSWORD),
    };

    await repositoryDb.insertOne(repositoryDb.CollectionName.AUTHTOKENS, dataToken);
  } catch (error) {
    logger.error(`Error creating api user. Error: ${error.message}`);
  }
};

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

module.exports = {
  createUserApi,
  getRepositoriesAndSave,
};
