const { assert } = require('chai');
const sinon = require('sinon');
const Chance = require('chance');

const { getRepositoriesAndSave } = require('../../../lib/repositories/service');
const { createUserApi } = require('../../../lib/authorization/services');
const dataBase = require('../../../lib/commons/repositoryDb');
const { repository } = require('../../fixed');
const nocks = require('../../nocks');

const chance = new Chance();

describe('Unit tests for searching repositories on GitHub', () => {
  process.env.GITHUB_LANGUAGES = 'php';
  const collectionNameRepositories = dataBase.CollectionName.REPOSITORIES;

  afterEach(async () => {
    await dataBase.deleteMany(collectionNameRepositories);
  });

  it('Should fetch the repositories from GitHub and save successfully', async () => {
    const page = 1;
    const optionsNock = {
      language: `language:${process.env.GITHUB_LANGUAGES}`,
      page,
      data: {
        total_count: chance.natural(),
        incomplete_results: false,
        items: [repository()],
      },
    };
    const nockGet = nocks.getRepositoriesByLanguage(optionsNock);
    await getRepositoriesAndSave(page);
    const data = await dataBase.find(collectionNameRepositories);

    assert.isDefined(data);
    assert.strictEqual(data.length, 1);
    assert.isTrue(nockGet.isDone());
  });

  it('It should fetch two pages from the GitHub repository and save successfully', async () => {
    const page = 1;
    const optionsNock = {
      language: `language:${process.env.GITHUB_LANGUAGES}`,
      page,
      data: {
        total_count: chance.natural(),
        incomplete_results: true,
        items: [repository()],
      },
    };
    const nockGet = nocks.getRepositoriesByLanguage(optionsNock);
    await getRepositoriesAndSave(page);
    const data = await dataBase.find(collectionNameRepositories);

    assert.isDefined(data);
    assert.strictEqual(data.length, 1);
    assert.isTrue(nockGet.isDone());
  });

  it('Should fetch the repositories from GitHub and error', async () => {
    const page = 1;
    const optionsNock = {
      language: `language:${process.env.GITHUB_LANGUAGES}`,
      page,
      error: new Error(),
    };
    const nockGet = nocks.getRepositoriesByLanguage(optionsNock);
    await getRepositoriesAndSave(page);
    const data = await dataBase.find(collectionNameRepositories);

    assert.isDefined(data);
    assert.strictEqual(data.length, 0);
    assert.isTrue(nockGet.isDone());
  });

  it('Should fetch the repositories from GitHub and error save db', async () => {
    const page = 1;
    const optionsNock = {
      language: `language:${process.env.GITHUB_LANGUAGES}`,
      page,
      data: {
        total_count: chance.natural(),
        incomplete_results: false,
        items: [repository()],
      },
    };
    const sandbox = sinon.stub(dataBase, 'insertMany').throws(Error('db query failed'));
    const nockGet = nocks.getRepositoriesByLanguage(optionsNock);
    await getRepositoriesAndSave(page);
    const data = await dataBase.find(collectionNameRepositories);

    assert.strictEqual(data.length, 0);
    assert.isTrue(nockGet.isDone());
    sandbox.restore();
  });

  it('Should must create a default user for application', async () => {
    await createUserApi();
    const data = await dataBase.find(dataBase.CollectionName.AUTHTOKENS);

    assert.isDefined(data);
    assert.strictEqual(data.length, 1);
  });

  it('Should must create a default user for application and return error', async () => {
    const sandbox = sinon.stub(dataBase, 'insertOne').throws(Error('db query failed'));

    await createUserApi();
    const data = await dataBase.find(dataBase.CollectionName.AUTHTOKENS);

    assert.strictEqual(data.length, 0);
    sandbox.restore();
  });
});
