/**
 * Unified error handling middleware.
 *
 * @param {Error} err - Error object.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 *
 * @return {void}
 */
export function errorHandler(err, req, res) {
  const statusCode = err && err.statusCode ? err.statusCode : 500;
  const message = err.message || "Server error";

  console.log(err);
  res.status(statusCode).json({ message });
}

/**
 * Wraps an async function as an Express middleware
 *
 * @param {function} fn - The async function to be wrapped
 * @returns {function} The Express middleware function
 */
export function asyncMiddleware(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
