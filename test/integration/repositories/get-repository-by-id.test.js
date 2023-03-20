const supertest = require('supertest');
const sinon = require('sinon');
const { assert } = require('chai');

const server = require('../../../lib/server');
const repositoryDb = require('../../../lib/commons/repositoryDb');
const { repository } = require('../../fixed');

describe('GET /repositores/:id', () => {
  let app;

  const insertRepository = async (item) => {
    const data = await repositoryDb.insertOne(repositoryDb.CollectionName.REPOSITORIES, item);
    return data;
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

  it('Should search an repository by id', async () => {
    const newRepositoryFixed = repository();
    await insertRepository(newRepositoryFixed);

    const result = await supertest(app)
      .get(`/repositories/${newRepositoryFixed.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${process.env.API_DEFAULT_PASSWORD}`)
      .expect(200);

    assert.isDefined(result.body);
    assert.strictEqual(result.body.name, newRepositoryFixed.name);
  });

  it('Search repository by id and return 204', async () => {
    await supertest(app)
      .get('/repositories/1234')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${process.env.API_DEFAULT_PASSWORD}`)
      .expect(204);
  });

  it('Search repository by id and return 500', async () => {
    const sandbox = sinon.stub(repositoryDb, 'findById').throws(Error('db query failed'));
    await supertest(app)
      .get('/repositories/1212')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${process.env.API_DEFAULT_PASSWORD}`)
      .expect(500);

    sandbox.restore();
  });
});
