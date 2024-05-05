const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
const attempts = {};

async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    const attemptData = attempts[email] || { attempts: 0, lastAttemptTimestamp: 0,};
    const maxAttempts = 5;
    const resetIntervalMs = 30 * 60 * 1000;

    if (
      attemptData.attempts >= maxAttempts &&
      attemptData.lastAttemptTimestamp &&
      Date.now() - attemptData.lastAttemptTimestamp < resetIntervalMs
    ) {
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too many failed login attempts'
      );
    }

    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      attempts[email] = {
        attempts: attemptData.attempts + 1,
        lastAttemptTimestamp: Date.now(),
      };

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }
    delete attempts[email];
    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
