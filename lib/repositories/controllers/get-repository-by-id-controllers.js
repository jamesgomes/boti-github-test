const logger = require('node-color-log');
const service = require('../service');

module.exports = async (req, res) => {
  const { data, error } = await service.getRepositoriesBayId(req.params.id);
  if (error) {
    logger.error(`Error get repository by id: ${error.message}`);
    return res.sendStatus(500);
  }
  if (!data) {
    return res.sendStatus(204);
  }
  return res.status(200).send(data);
};
