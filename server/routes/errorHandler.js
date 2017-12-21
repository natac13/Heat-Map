function makeResponse(error) {
  return {
    success: false,
    errorType: error.type,
    error,
  };
}

function errorHandler(err, req, res, next) {
  res.status(200).json(makeResponse(err));
  next();
}

export default errorHandler;
