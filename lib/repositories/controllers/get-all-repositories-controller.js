const logger = require('node-color-log');
const repositoryDb = require('../../commons/repositoryDb');

module.exports = async (req, res) => {
  try {
    const data = await repositoryDb.find(
      repositoryDb.CollectionName.REPOSITORIES,
      {},
      {},
      { stargazers_count: 1.0 },
      {},
    );
    if (!data.length) {
      return res.sendStatus(204);
    }
    return res.status(200).send(data);
  } catch (err) {
    logger.error(`Error at list repositories. Error: ${err.message}`);
    return res.sendStatus(500);
  }
};
