const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const loans = require('./components/loans/loans-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  loans(app);

  return app;
};
