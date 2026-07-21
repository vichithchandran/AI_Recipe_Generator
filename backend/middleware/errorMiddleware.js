export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Handle Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate field value entered for ${field}.`;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(', ');
    errors = Object.keys(err.errors).map((key) => ({
      field: key,
      message: err.errors[key].message,
    }));
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
