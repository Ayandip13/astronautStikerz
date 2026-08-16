const mongoose = require('mongoose');

const dbCheck = (req, res, next) => {
    // 1 means connected. 0 = disconnected, 2 = connecting, 3 = disconnecting
    if (mongoose.connection.readyState !== 1) {
        res.status(503);
        return next(new Error('Database is temporarily unavailable. Please try again later.'));
    }
    next();
};

module.exports = dbCheck;
