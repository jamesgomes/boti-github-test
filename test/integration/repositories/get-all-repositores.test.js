const supertest = require('supertest');
const sinon = require('sinon');
const { assert } = require('chai');

const server = require('../../../lib/server');
const repositoryDb = require('../../../lib/commons/repositoryDb');
const { repository } = require('../../fixed');

describe('GET /repositores', () => {
  process.env.GITHUB_LIMIT_ITEMS = 1;
  let app;

  const insertRepository = async (item) => {
    await repositoryDb.insertOne(repositoryDb.CollectionName.REPOSITORES, item);
  };

  before(async () => {
    app = await server.start();
  });

  after(async () => {
    await server.stop();
  });

  afterEach(async () => {
    await repositoryDb.deleteMany(repositoryDb.CollectionName.REPOSITORES);
  });

  it('Search all repositores', async () => {
    const newRepositoryFixed = repository();
    await insertRepository(newRepositoryFixed);
    const result = await supertest(app)
      .get('/repositores')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer senha')
      .expect(200);
    assert.strictEqual(result.body.length, 1);
    assert.strictEqual(result.body[0].name, newRepositoryFixed.name);
  });

  it('Search all repositores and return 204', async () => {
    await supertest(app)
      .get('/repositores')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer senha')
      .expect(204);
  });

  it('Search all repositores and return 500', async () => {
    const sandbox = sinon.stub(repositoryDb, 'find').throws(Error('db query failed'));
    await supertest(app)
      .get('/repositores')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer senha')
      .expect(500);

    sandbox.restore();
  });
});
