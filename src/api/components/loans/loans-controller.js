const loansService = require('./loans-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function getLoans(request, response, next) {
  try {
    const { page_number, page_size, sort, search } = request.query;
    const result = await loansService.getLoans({
      page_number,
      page_size,
      sort,
      search,
    });
    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function getLoan(request, response, next) {
  try {
    const loan = await loansService.getLoan(request.params.id);

    if (!loan) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown loan');
    }

    return response.status(200).json(loan);
  } catch (error) {
    return next(error);
  }
}

async function createLoan(request, response, next) {
  try {
    const amount = request.body.amount;
    const notes = request.body.notes;
    const instalment = request.body.instalment;

    const success = await loansService.createLoan(amount, notes, instalment);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create loan'
      );
    }

    return response.status(200).json({ amount, notes, instalment });
  } catch (error) {
    return next(error);
  }
}

async function updateLoan(request, response, next) {
  try {
    const id = request.params.id;
    const amount = request.body.amount;
    const notes = request.body.notes;
    const instalment = request.body.instalment;

    const success = await loansService.updateLoan(
      id,
      amount,
      notes,
      instalment
    );
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update loan'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

async function deleteLoan(request, response, next) {
  try {
    const id = request.params.id;

    const success = await loansService.deleteLoan(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete loan'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getLoans,
  getLoan,
  createLoan,
  updateLoan,
  deleteLoan,
};
