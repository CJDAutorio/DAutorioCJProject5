const validator = require('validator');
const event = require('../models/event');

exports.isDateValid = (req, res, next) => {
    // if (!(event.startDate && validator.isAfter(event.startDate, Date.now()))){
    //     let err = new Error('Invalid start date');
    //             err.status = 400;
    //             return next(err);
    // }

    // if (!((event.endDate && validator.isISO8601(event.endDate)) && validator.isAfter(event.endDate, Date.now()))){
    //     let err = new Error('Invalid end date');
    //             err.status = 400;
    //             return next(err);
    // }

    // if (!(validator.isAfter(event.startDate, event.endDate))) {
    //     let err = new Error('Invalid dates');
    //             err.status = 400;
    //             return next(err);
    // }
}