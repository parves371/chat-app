const errrorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  if (err.code === 11000) {
    const error = Object.keys(err.keyPattern).join(", ");
    err.message = `Duplicate fields - ${error}`;
    err.statusCode = 400;
  }
  if (err.name === "CastError") {
    err.message = `Invalid ${err.path}: ${err.value}`;
    err.statusCode = 400;
  }

  return res.status(err.statusCode).json({
    success: false,
    message: process.env.NODE_ENV === "development" ? err : err.message,
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
