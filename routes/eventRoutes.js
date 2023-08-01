const express = require('express');
const controller = require('../controllers/eventController');
const { fileUpload } = require('../middleware/fileUpload');
const { isLoggedIn, isAuthor, isValidEventId } = require('../middleware/auth');
const { postLimiter, rsvpLimiter } = require('../middleware/rateLimiters');
const { isDateValid } = require('../middleware/postValidation');

const router = express.Router();


// GET /events: send all events to the user
router.get('/', controller.index);

// GET /events/new: send html form for creating a new event
router.get('/new', isLoggedIn, controller.new);

// POST /events: create a new event
router.post('/', postLimiter, isLoggedIn, fileUpload, controller.createEvent);

// GET /events/:id: send details of event identified by id
router.get('/:id', isValidEventId, controller.event);

//GET /events/:id/edit: send html form for editing an existing event
router.get('/:id/edit', isLoggedIn, isAuthor, isValidEventId, controller.edit);

//PUT /events/:id: update the event idenfitied by id
router.put('/:id', postLimiter, isLoggedIn, isAuthor, isValidEventId, fileUpload, controller.update);

//DELETE /events/:id: delete the event identified by id
router.delete('/:id', postLimiter, isLoggedIn, isAuthor, isValidEventId, controller.delete);

// POST /events/:id/rsvp: rsvp to an event
router.post('/:id/rsvp', rsvpLimiter, isLoggedIn, isValidEventId, controller.rsvp);

module.exports = router;