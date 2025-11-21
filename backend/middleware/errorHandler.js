/**
 * Error handling middleware
 * Catches and formats errors for consistent API responses
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    // Default error status and message
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Don't leak error details in production
    const response = {
        success: false,
        error: message
    };

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(status).json(response);
};

module.exports = errorHandler;
