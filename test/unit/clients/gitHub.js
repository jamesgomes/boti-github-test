const { assert } = require('chai');
const Chance = require('chance');
const { repository } = require('../../fixed');

const chance = new Chance();

const getRepositoriesByLanguage = require('../../../lib/clients/gitHub');
const nocks = require('../../nocks');

describe('Unit tests for getRepositoriesByLanguage', () => {
  it('Should get repositories successfully', async () => {
    const optionsNock = {
      language: 'language:php',
      perPage: process.env.GITHUB_LIMIT_ITEMS,
      data: {
        total_count: chance.natural(),
        incomplete_results: true,
        items: [repository()],
      },
    };
    const nockGet = nocks.getRepositoriesByLanguage(optionsNock);

    const { data, error } = await getRepositoriesByLanguage(['php'], process.env.GITHUB_LIMIT_ITEMS);

    assert.isUndefined(error);
    assert.isDefined(data);
    assert.isTrue(nockGet.isDone());
  });

  it('Should return error when fail on get repositories', async () => {
    const optionsNock = {
      language: 'language:php',
      perPage: process.env.GITHUB_LIMIT_ITEMS,
      error: new Error(),
    };
    const nockGet = nocks.getRepositoriesByLanguage(optionsNock);

    const { data, error } = await getRepositoriesByLanguage(['php'], process.env.GITHUB_LIMIT_ITEMS);

    assert.isDefined(error);
    assert.isUndefined(data);
    assert.isTrue(nockGet.isDone());
  });
});
