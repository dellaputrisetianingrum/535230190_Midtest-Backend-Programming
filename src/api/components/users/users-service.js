const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers({ page_number, page_size, sort, search }) {
  let users = await usersRepository.getUsers();
  if (search) {
    const [field, searchKey] = search.split(':');
    if (field && (field === 'email' || field === 'name') && searchKey) {
      const regex = new RegExp(searchKey, 'i');
      users = users.filter((user) => regex.test(user[field]));
    }
  }
  let sortField = 'email';
  let sortOrder = 1;
  if (sort) {
    const [field, order] = sort.split(':');
    if (field && (field === 'email' || field === 'name')) {
      sortField = field;
    }
    if (order && order.toLowerCase() === 'desc') {
      sortOrder = -1;
    }
  }
  users.sort((a, b) => {
    if (a[sortField] < b[sortField]) return -1 * sortOrder;
    if (a[sortField] > b[sortField]) return 1 * sortOrder;
    return 0;
  });

  let count = users.length;
  let total_pages = Math.ceil(count / page_size);
  page_number = parseInt(page_number) || 1;
  page_size = parseInt(page_size) || count;
  const startIndex = (page_number - 1) * page_size;
  const endIndex = startIndex + page_size;
  const paginatedUsers = users.slice(startIndex, endIndex);
  const has_previous_page = page_number > 1;
  const has_next_page = page_number < total_pages;

  return (response = {
    page_number,
    page_size,
    count,
    total_pages,
    has_previous_page,
    has_next_page,
    data: paginatedUsers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    })),
  });
}
/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
