/**
 * Handles error occurred during the execution of a request.
 *
 * @param {Error} err - The error object containing details of the error.
 * @param {Object} req - The request object with details of the HTTP request.
 * @param {Object} res - The response object used to send the HTTP response.
 * @param {Function} next - The next function to call in the middleware chain.
 *
 * @return {void}
 */
function errorHandler(err, req, res, next) {
  const statusCode = err && err.statusCode ? err.statusCode : 500;
  const message = err.message || "An error occurred";

  console.log(err);
  res.status(statusCode).json({ message });

  next();
}

export default errorHandler;
