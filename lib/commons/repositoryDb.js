const database = require('../database');

const CollectionName = {
  REPOSITORES: 'repositores',
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

const insertMany = (collectionName, data) => database
  .getCollection(collectionName)
  .insertMany(data);

const deleteMany = (collectionName, filter, options = {}) => database.getCollection(collectionName)
  .deleteMany(filter, options);

module.exports = {
  CollectionName,
  insertMany,
  find,
  deleteMany,
};
