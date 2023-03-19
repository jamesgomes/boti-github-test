const repositoresControllers = require('./controllers');
const { isAuthenticated } = require('../authorization');

const routes = (router) => {
  router.get('/repositores', isAuthenticated, repositoresControllers.getAllRepositores);
  router.get('/repositores/:id', isAuthenticated, repositoresControllers.getRepositoryById);
};

module.exports = routes;
