const supertest = require('supertest');
const sinon = require('sinon');
const { assert } = require('chai');

const server = require('../../../lib/server');
const repositoryDb = require('../../../lib/commons/repositoryDb');
const { repository } = require('../../fixed');

describe('GET /repositores/:id', () => {
  process.env.GITHUB_LIMIT_ITEMS = 1;
  let app;

  const insertRepository = async (item) => {
    const data = await repositoryDb.insertOne(repositoryDb.CollectionName.REPOSITORES, item);
    return data;
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

  it('Should search an repository by id', async () => {
    const newRepositoryFixed = repository();
    const { insertedId } = await insertRepository(newRepositoryFixed);

    const result = await supertest(app)
      .get(`/repositores/${insertedId}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer senha')
      .expect(200);

    assert.isDefined(result.body);
    assert.strictEqual(result.body.name, newRepositoryFixed.name);
  });

  it('Search repository by id and return 204', async () => {
    await supertest(app)
      .get('/repositores/5e3c88ccd1ee050146126654')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer senha')
      .expect(204);
  });

  it('Search repository by id and return 500', async () => {
    const sandbox = sinon.stub(repositoryDb, 'findById').throws(Error('db query failed'));
    await supertest(app)
      .get('/repositores/5e3c88ccd1ee050146126654')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer senha')
      .expect(500);

    sandbox.restore();
  });
});
