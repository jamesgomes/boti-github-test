const logger = require('node-color-log');
const repositoryDb = require('../../commons/repositoryDb');

module.exports = async (req, res) => {
  try {
    const data = await repositoryDb.findById(
      repositoryDb.CollectionName.REPOSITORIES,
      req.params.id,
    );
    if (!data) {
      return res.sendStatus(204);
    }
    return res.status(200).send(data);
  } catch (err) {
    logger.error(`Error get repository by id: ${err}`);
    return res.sendStatus(500);
  }
};
