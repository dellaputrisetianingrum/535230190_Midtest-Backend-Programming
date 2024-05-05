const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const loansControllers = require('./loans-controller');
const loansValidator = require('./loans-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/loans', route);

  route.get('/', authenticationMiddleware, loansControllers.getLoans);

  route.post(
    '/',
    authenticationMiddleware,
    celebrate(loansValidator.createLoan),
    loansControllers.createLoan
  );

  route.get('/:id', authenticationMiddleware, loansControllers.getLoan);

  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(loansValidator.updateLoan),
    loansControllers.updateLoan
  );

  route.delete('/:id', authenticationMiddleware, loansControllers.deleteLoan);
};
