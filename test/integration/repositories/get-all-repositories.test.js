const supertest = require('supertest');
const sinon = require('sinon');
const { assert } = require('chai');

const server = require('../../../lib/server');
const repositoryDb = require('../../../lib/commons/repositoryDb');
const { repository } = require('../../fixed');

describe('GET /repositories', () => {
  let app;

  const insertRepository = async (item) => {
    await repositoryDb.insertOne(repositoryDb.CollectionName.REPOSITORIES, item);
  };

  before(async () => {
    app = await server.start();
  });

  after(async () => {
    await server.stop();
  });

  afterEach(async () => {
    await repositoryDb.deleteMany(repositoryDb.CollectionName.REPOSITORIES);
  });

  it('Search all repositories', async () => {
    const newRepositoryFixed = repository();
    await insertRepository(newRepositoryFixed);
    const result = await supertest(app)
      .get('/repositories')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${process.env.API_DEFAULT_PASSWORD}`)
      .expect(200);

    assert.strictEqual(result.body.length, 1);
    assert.strictEqual(result.body[0].name, newRepositoryFixed.name);
  });

  it('Search all repositories and return 204', async () => {
    await supertest(app)
      .get('/repositories')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${process.env.API_DEFAULT_PASSWORD}`)
      .expect(204);
  });

  it('Search all repositories and return 500', async () => {
    const sandbox = sinon.stub(repositoryDb, 'find').throws(Error('db query failed'));
    await supertest(app)
      .get('/repositories')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${process.env.API_DEFAULT_PASSWORD}`)
      .expect(500);

    sandbox.restore();
  });
});
