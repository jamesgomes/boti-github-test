const sha256 = require('sha256');

const { findToken } = require('../repository');

const getToken = async (token) => findToken({
  token: sha256(token),
});

module.exports = {
  getToken,
};
