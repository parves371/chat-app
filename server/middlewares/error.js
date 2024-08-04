const errrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

const tryCatch = (passesFunc) => async (req, res, next) => {
  try {
    await passesFunc(req, res, next);
  } catch (error) {
    next(error);
  }
};

export { errrorMiddleware, tryCatch };
