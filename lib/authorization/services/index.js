const sha256 = require('sha256');
const logger = require('node-color-log');
const { findToken } = require('../repository');

const getToken = async (token) => findToken({
  token: sha256(token),
});

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

module.exports = {
  getToken,
  createUserApi,
};
