require('dotenv').config();
const sha256 = require('sha256');
const db = require('../lib/database');

before(async () => {
  process.env.MONGODB_URI += '_test';
  const dataToken = {
    userId: 'grupoboticario',
    token: sha256('senha'),
  };
  await db.connect();
  await db.getCollection('oauthtokens').insertOne(dataToken);
});

after(async () => {
  await db.getCollection('repositores').deleteMany();
  await db.close();
});
