const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

/**
 * Health check endpoint
 * Returns server and database status
 */
router.get("/", async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

        const health = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: dbStatus,
            environment: process.env.NODE_ENV || 'development'
        };

        const httpStatus = dbStatus === 'connected' ? 200 : 503;

        res.status(httpStatus).json(health);
    } catch (error) {
        res.status(503).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

module.exports = router;
