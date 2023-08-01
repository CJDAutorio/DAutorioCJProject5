const eventsModel = require('../models/event');
const rsvpModel = require('../models/rsvp');

exports.index = (req, res, next) => {
    // let events = model.find();
    // res.render('./event/index', {events});
    eventsModel.find()
        .then(events => {
            const sports = [], videoGame = [], board = [], card = [], other = [];
            events.forEach(event => {
                if (event.category == 'Sports') {
                    sports.push(event);
                } else if (event.category == 'VideoGame') {
                    videoGame.push(event);
                } else if (event.category == 'Board') {
                    board.push(event);
                } else if (event.category == 'Card') {
                    card.push(event);
                } else if (event.category == 'Other') {
                    other.push(event);
                } else {
                    console.log('Error adding event to array\nEvent:', event);
                }
            })
            // res.render('./event/index', { events })
            res.render('./event/index', { events, sports, videoGame, board, card, other })
        })
        .catch(err => next(err));
};

exports.new = (req, res) => {
    res.render('./event/newEvent');
};

exports.createEvent = (req, res, next) => {
    let event = new eventsModel(req.body);    // Create a new story document
    event.hostName = req.session.user;
    event.image = "../images/" + req.file.filename;
    console.log('event:', event);
    event.save()    // Insert the document into the database
        .then((event) => {
            res.redirect('/events');
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
            }
            next(err);
        });
};

exports.event = (req, res, next) => {
    let id = req.params.id;
    let rsvpCount = 0;
    console.log('req.params', req.params);
    console.log('id', id);
    eventsModel.findById(id).populate('hostName', 'firstName lastName')
        .then(event => {
            if (event) {
                rsvpModel.find({ event: id })
                    .then(rsvpList => {
                        console.log('rsvpList:', rsvpList);
                        rsvpList.forEach((rsvp) => {
                            if (rsvp.status === 'YES') {
                                rsvpCount++;
                                console.log('rsvpCount:', rsvpCount);
                            }
                        })
                        return res.render('./event/event', { event, rsvpCount });
                    })
                    .catch(err => next(err));
            } else {
                let err = new Error('Cannot find an event with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    console.log('edit');
    eventsModel.findById(id)
        .then(event => {
            console.log('startDate:', event.startDate, '\nendDate:', event.endDate);
            const startDateString = event.startDate.toISOString().slice(0, 16);
            const endDateString = event.endDate.toISOString().slice(0, 16);

            if (event) {
                return res.render('./event/edit', { event, startDateString, endDateString });
            } else {
                let err = new Error('Cannot find an event with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

exports.update = (req, res, next) => {
    let event = req.body;
    let id = req.params.id;

    eventsModel.findByIdAndUpdate(id, event, { useFindAndModify: false, runValidators: true })
        .then(event => {
            if (event) {
                res.redirect('/events/' + id);
            } else {
                let err = new Error('Cannot find an event with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                err.status = 400;
            }
            next(err);
        });
};

exports.delete = (req, res, next) => {
    let id = req.params.id;

    eventsModel.findByIdAndDelete(id, { useFindAndModify: false })
        .then(event => {
            if (event) {
                rsvpModel.deleteMany({event: id})
                    .then(rsvp => {
                        res.redirect('/events');
                    })
                    .catch(err => next(err));
            } else {
                let err = new Error('Cannot find an event with id ' + id);
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err));
};

exports.rsvp = (req, res, next) => {
    const eventId = req.params.id;
    const userId = req.session.user;
    const rsvpStatus = req.body.rsvpStatus;
    console.log('eventId:', eventId, '\nuserId:', userId, '\nrsvpStatus', rsvpStatus, '\nreq.body:', req.body);

    if (!(rsvpStatus && validator.isIn(rsvpStatus, ['YES', 'NO', 'MAYBE']))) {
        next(err);
    }

    rsvpModel.findOneAndUpdate(
        {event: eventId, user: userId},
        {status: rsvpStatus},
        {new: true}
    )
        .then(rsvp => {
            if (rsvp) {
                res.redirect('/events/' + eventId);
            } else {
                let rsvp = new rsvpModel({
                    event: eventId,
                    user: userId,
                    status: rsvpStatus
                });    // Create a new rsvp
                rsvp.save()    // Insert the document into the database
                    .then((rsvp) => {
                        res.redirect('/events/' + eventId);
                    })
                    .catch(err => {
                        if (err.name === 'ValidationError') {
                            err.status = 400;
                        }
                        next(err);
                    });
            }
        })
        .catch(err => next(err));
}
