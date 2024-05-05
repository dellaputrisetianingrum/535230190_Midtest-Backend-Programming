const joi = require('joi');

module.exports = {
  createLoan: {
    body: {
      amount: joi.number().required().label('Amount'),
      notes: joi.string().min(1).max(100).required().label('Notes'),
      instalment: joi.string().min(1).max(100).required().label('Instalment'),
    },
  },

  updateLoan: {
    body: {
      amount: joi.number().required().label('Amount'),
      notes: joi.string().min(1).max(100).required().label('Notes'),
      instalment: joi.string().min(1).max(100).required().label('Instalment'),
    },
  },
};
