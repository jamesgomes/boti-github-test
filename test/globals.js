require('dotenv').config();
const sha256 = require('sha256');
const db = require('../lib/database');

before(async () => {
  process.env.MONGODB_URI += '_test';
  const dataToken = {
    userId: 'grupoboticario',
    token: sha256(process.env.API_DEFAULT_PASSWORD),
  };
  await db.connect();
  await db.getCollection('oauthtokens').insertOne(dataToken);
});

after(async () => {
  await db.getCollection('oauthtokens').deleteMany();
  await db.getCollection('repositories').deleteMany();
  await db.close();
});
