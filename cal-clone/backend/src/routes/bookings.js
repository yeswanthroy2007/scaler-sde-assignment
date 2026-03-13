const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/', bookingController.getBookings);
router.post('/', bookingController.createBooking);
router.delete('/:id', bookingController.deleteBooking);
router.put('/:id/reschedule', bookingController.rescheduleBooking);
router.get('/slots', bookingController.getAvailableSlots);

module.exports = router;
