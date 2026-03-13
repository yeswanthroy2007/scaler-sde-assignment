const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getEvents);
router.post('/', eventController.createEvent);
router.put('/:id', eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);
router.get('/slug/:slug', eventController.getEventBySlug);

router.get('/:eventId/questions', eventController.getQuestions);
router.post('/:eventId/questions', eventController.createQuestion);

module.exports = router;
