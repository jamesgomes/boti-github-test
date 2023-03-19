const passport = require('passport');
const { Strategy } = require('passport-http-bearer');
const { getToken } = require('./services');

const init = () => {
  passport.use(new Strategy((token, callback) => {
    getToken(token)
      .then((result) => {
        if (result) {
          return callback(null, 200, {
            scope: 'all',
          });
        }
        return callback(null, false);
      })
      .catch((err) => callback(err, false));
  }));
};

const isAuthenticated = passport.authenticate('bearer', {
  session: false,
});

module.exports = {
  init,
  isAuthenticated,
};
