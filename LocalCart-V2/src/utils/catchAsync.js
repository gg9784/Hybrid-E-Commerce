/**
 * Wrapper for async controller functions to pass errors to the error middleware
 * effectively removing the need for try-catch blocks in controllers.
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
