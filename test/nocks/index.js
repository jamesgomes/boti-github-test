const nock = require('nock');

const nocks = {};

nocks.getRepositoriesByLanguage = (options) => {
  const newOptions = options || {};
  const path = '/search/repositories';
  const query = `?q=${newOptions.language}&sort=stargazers_count&order=desc&per_page=100&page=${newOptions.page}`;
  if (newOptions.error) {
    return nock(process.env.GITHUB_URL)
      .get(`${path}${query}`)
      .replyWithError(newOptions.error);
  }

  return nock(process.env.GITHUB_URL)
    .get(`${path}${query}`)
    .reply(newOptions.statusCode || 200, newOptions.data);
};

module.exports = nocks;
