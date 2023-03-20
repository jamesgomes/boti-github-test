require('dotenv').config();
const { assert } = require('chai');
const Chance = require('chance');
const { repository } = require('../../fixed');

const getRepositoriesByLanguages = require('../../../lib/clients/gitHub');
const nocks = require('../../nocks');

const chance = new Chance();

describe('Unit tests for getRepositoriesByLanguages', () => {
  it('Should fetch repositories successfully with no next page', async () => {
    const optionsNock = {
      language: 'language:php',
      page: 1,
      data: {
        total_count: chance.natural(),
        incomplete_results: false,
        items: [repository()],
      },
    };
    const nockGet = nocks.getRepositoriesByLanguage(optionsNock);

    const { data, error } = await getRepositoriesByLanguages(['php'], 1);

    assert.isUndefined(error);
    assert.isDefined(data.items);
    assert.strictEqual(data.nextPage, -1);
    assert.isTrue(nockGet.isDone());
  });

  it('Should fetch repositories successfully with next page', async () => {
    const optionsNock = {
      language: 'language:php',
      page: 1,
      data: {
        total_count: chance.natural(),
        incomplete_results: true,
        items: [repository()],
      },
    };
    const nockGet = nocks.getRepositoriesByLanguage(optionsNock);

    const { data, error } = await getRepositoriesByLanguages(['php'], 1);

    assert.isUndefined(error);
    assert.isDefined(data.items);
    assert.strictEqual(data.nextPage, 2);
    assert.isTrue(nockGet.isDone());
  });

  it('Should return error when fail on get repositories', async () => {
    const optionsNock = {
      language: 'language:php',
      page: 1,
      error: new Error(),
    };
    const nockGet = nocks.getRepositoriesByLanguage(optionsNock);

    const { data, error } = await getRepositoriesByLanguages(['php'], 1);

    assert.isDefined(error);
    assert.isUndefined(data);
    assert.isTrue(nockGet.isDone());
  });
});
