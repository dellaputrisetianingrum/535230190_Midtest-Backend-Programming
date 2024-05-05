const { instalment } = require('../../../models/loans-schema');
const loansRepository = require('./loans-repository');

async function getLoans({ page_number = 1, page_size = 10, sort, search }) {
  let loans = await loansRepository.getLoans();
  if (search) {
    const [field, searchKey] = search.split(':');
    if (field && (field === 'notes' || field === 'instalment') && searchKey) {
      const regex = new RegExp(searchKey, 'i');
      loans = loans.filter((loan) => regex.test(loan[field]));
    }
  }

  let sortField = 'notes';
  let sortOrder = 1;

  if (sort) {
    const [field, order] = sort.split(':');
    if (field && (field === 'notes' || field === 'instalment')) {
      sortField = field;
    }
    if (order && order.toLowerCase() === 'desc') {
      sortOrder = -1;
    }
  }

  loans.sort((a, b) => {
    if (a[sortField] < b[sortField]) return -1 * sortOrder;
    if (a[sortField] > b[sortField]) return 1 * sortOrder;
    return 0;
  });

  const count = loans.length;
  const total_pages = Math.ceil(count / page_size);
  const startIndex = (page_number - 1) * page_size;
  const endIndex = startIndex + page_size;
  const data = loans.slice(startIndex, endIndex);
  const has_previous_page = page_number > 1;
  const has_next_page = endIndex < count;

  const formattedResponse = {
    page_number,
    page_size,
    count,
    total_pages,
    has_previous_page,
    has_next_page,
    data: data.map((loan) => ({
      id: loan.id,
      amount: loan.amount,
      notes: loan.notes,
      instalment: loan.instalment,
    })),
  };

  return formattedResponse;
}

async function getLoan(id) {
  const loan = await loansRepository.getLoan(id);

  // Loan not found
  if (!loan) {
    return null;
  }

  return {
    id: loan.id,
    amount: loan.amount,
    notes: loan.notes,
    instalment: loan.instalment,
  };
}

async function createLoan(amount, notes, instalment) {
  try {
    await loansRepository.createLoan(amount, notes, instalment);
  } catch (err) {
    return null;
  }

  return true;
}

async function updateLoan(id, amount, notes, instalment) {
  const loan = await loansRepository.getLoan(id);

  if (!loan) {
    return null;
  }

  try {
    await loansRepository.updateLoan(id, amount, notes, instalment);
  } catch (err) {
    return null;
  }

  return true;
}

async function deleteLoan(id) {
  const loan = await loansRepository.getLoan(id);

  // Loan not found
  if (!loan) {
    return null;
  }

  try {
    await loansRepository.deleteLoan(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  getLoans,
  getLoan,
  createLoan,
  updateLoan,
  deleteLoan,
};
