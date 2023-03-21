const repositoriesControllers = require('./controllers');
const { isAuthenticated } = require('../authorization');

const routes = (router) => {
  router.get('/repositories', isAuthenticated, repositoriesControllers.getRepositoriesByQuery);
  router.get('/repositories/:id', isAuthenticated, repositoriesControllers.getRepositoryById);
};

module.exports = routes;
