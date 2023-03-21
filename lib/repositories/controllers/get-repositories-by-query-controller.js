const logger = require('node-color-log');
const service = require('../service');

module.exports = async (req, res) => {
  const { data, error } = await service.getRepositoriesByQuery(req.query);
  if (error) {
    logger.error(`Error at list repositories. Error: ${error.message}`);
    return res.sendStatus(500);
  }
  if (!data.length) {
    return res.sendStatus(204);
  }
  return res.status(200).send(data);
};
