const rateLimit = require("express-rate-limit");

exports.logInLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    message: 'Too many login requests. Try again later.',
    handler: (req, res, next) => {
        let err = new Error('Too many login requests. Try again later.');
        err.status = 429;
        return next(err);
    }
});

exports.postLimiter = rateLimit({
    windowMs: 30 * 1000,
    max: 5,
    message: 'Too many post requests. Try again later.',
    handler: (req, res, next) => {
        let err = new Error('Too many post requests. Try again later.');
        err.status = 429;
        return next(err);
    }
});

exports.rsvpLimiter = rateLimit({
    windowMs: 500,
    max: 5,
    message: 'Too many RSVP requests. Try again later.',
    handler: (req, res, next) => {
        let err = new Error('Too many RSVP requests. Try again later.');
        err.status = 429;
        return next(err);
    }
});