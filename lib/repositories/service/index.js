const repositoryDb = require('../../commons/repositoryDb');

const collectionName = repositoryDb.CollectionName.REPOSITORIES;

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
};
