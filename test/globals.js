require('dotenv').config();
const db = require('../lib/database');

// const { authTokensFixture } = require('./collections-management/auth-token');
// const authorizationRepository = require('../lib/authorization/repository');

before(async () => {
  process.env.MONGODB_URI += '_test';
  await db.connect();

  // const authTokenFixture = authTokensFixture.create({
  //   clientId: 'cliente',
  //   token: 'senha',
  //   userId: 'teste',
  // });

  // await authorizationRepository.insertOne(authTokenFixture);
});

after(async () => {
  // await db.getCollection('journeys').deleteMany();
  await db.close();
});
