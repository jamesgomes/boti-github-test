const database = require('../database');

const CollectionName = {
  REPOSITORES: 'repositores',
  AUTHTOKENS: 'oauthtokens',
};

const find = (
  collectionName,
  filter,
  options = {},
  sort = {},
  collation = {},
  limit = 0,
  cursor = false,
) => {
  const query = {
    ...filter,
  };

  const result = database.getCollection(collectionName)
    .find(query, options)
    .collation(collation)
    .sort(sort)
    .limit(limit);

  return cursor ? result : result.toArray();
};

const insertOne = (collectionName, data) => database.getCollection(collectionName).insertOne(data);

const insertMany = (collectionName, data) => database
  .getCollection(collectionName)
  .insertMany(data);

const deleteMany = (collectionName, filter, options = {}) => database.getCollection(collectionName)
  .deleteMany(filter, options);

const findOne = (collectionName, filter, options = {}) => database.getCollection(collectionName)
  .findOne(filter, options);

const findById = (collectionName, id, options = {}) => findOne(
  collectionName,
  { id: Number(id) },
  options,
);

module.exports = {
  CollectionName,
  insertMany,
  find,
  deleteMany,
  findById,
  findOne,
  insertOne,
};
