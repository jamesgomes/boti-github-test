const repositoryDb = require('../../commons/repositoryDb');

const set = new Set();

const oauthTokensRepository = (() => {
  const findToken = async (filter) => {
    const token = set.has(filter.token);
    if (token) {
      return token;
    }
    const query = { token: filter.token };
    const result = await repositoryDb.findOne(
      repositoryDb.CollectionName.AUTHTOKENS,
      query,
    );
    if (result) {
      set.add(result.token);
      return result.token;
    }
    return null;
  };

  return {
    findToken,
  };
})();

module.exports = oauthTokensRepository;
