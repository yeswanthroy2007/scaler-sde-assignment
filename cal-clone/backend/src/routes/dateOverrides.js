const express = require('express');
const router = express.Router();
const overrideController = require('../controllers/dateOverrideController');

router.get('/', overrideController.getDateOverrides);
router.post('/', overrideController.createDateOverride);
router.delete('/:id', overrideController.deleteDateOverride);

module.exports = router;
