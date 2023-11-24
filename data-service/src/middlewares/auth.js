const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');

// Define a middleware to check the user's role
const checkRole = (req, resolve, reject, requiredRights) => async (err, info) => {
  if (err || info) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  // Get the user's role from the request header
  const role = req.header('role');
  // Check if the role is valid
  if (requiredRights.length) {
    const userRights = roleRights.get(role);
    const hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
    if (!hasRequiredRights) {
      return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
    }
  }
  // Pass the role to the next middleware
  req.role = role;
  resolve();
};

const auth =
  (...requiredRights) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      checkRole(req, resolve, reject, requiredRights)(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
