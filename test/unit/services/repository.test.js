const { assert } = require('chai');
const Chance = require('chance');

const { getRepositoriesAndSave } = require('../../../lib/service/repository');
const dataBase = require('../../../lib/commons/repositoryDb');
const { repository } = require('../../fixed');
const nocks = require('../../nocks');

const chance = new Chance();

describe('Unit tests for searching repositories on GitHub', () => {
  process.env.GITHUB_LANGUAGES = 'php';
  process.env.GITHUB_LIMIT_ITEMS = 1;
  const collectionName = dataBase.CollectionName.REPOSITORES;

  afterEach(async () => {
    await dataBase.deleteMany(collectionName);
  });

  it('Should fetch the repositories from GitHub and save successfully', async () => {
    const optionsNock = {
      language: `language:${process.env.GITHUB_LANGUAGES}`,
      perPage: process.env.GITHUB_LIMIT_ITEMS,
      data: {
        total_count: chance.natural(),
        incomplete_results: true,
        items: [repository()],
      },
    };
    const nockGet = nocks.getRepositoriesByLanguage(optionsNock);
    await getRepositoriesAndSave();
    const data = await dataBase.find(collectionName);

    assert.isDefined(data);
    assert.strictEqual(data.length, 1);
    assert.isTrue(nockGet.isDone());
  });

  it('Should fetch the repositories from GitHub and error', async () => {
    const optionsNock = {
      language: `language:${process.env.GITHUB_LANGUAGES}`,
      perPage: process.env.GITHUB_LIMIT_ITEMS,
      error: new Error(),
    };
    const nockGet = nocks.getRepositoriesByLanguage(optionsNock);
    await getRepositoriesAndSave();
    const data = await dataBase.find(collectionName);

    assert.isDefined(data);
    assert.strictEqual(data.length, 0);
    assert.isTrue(nockGet.isDone());
  });
});
