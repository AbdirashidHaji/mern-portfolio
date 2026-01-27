const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  console.error(err.stack);

  if (err.name === 'CastError') {
    error = { message: 'Resource not found', statusCode: 404 };
  }

  if (err.code === 11000) {
    error = { message: 'Duplicate field value entered', statusCode: 400 };
  }

  if (err.name === 'ValidationError') {
    error = { 
      message: Object.values(err.errors).map(val => val.message).join(', '), 
      statusCode: 400 
    };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};

export default errorHandler;