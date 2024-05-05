const { Loan } = require('../../../models');

async function getLoans() {
  return Loan.find({});
}

async function getLoan(id) {
  return Loan.findById(id);
}

async function createLoan(amount, notes, instalment) {
  return Loan.create({
    amount,
    notes,
    instalment,
  });
}

async function updateLoan(id, amount, notes, instalment) {
  return Loan.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        amount,
        notes,
        instalment,
      },
    }
  );
}

async function deleteLoan(id) {
  return Loan.deleteOne({ _id: id });
}

module.exports = {
  getLoans,
  getLoan,
  createLoan,
  updateLoan,
  deleteLoan,
};
