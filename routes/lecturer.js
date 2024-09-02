const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');
const { isAuthenticated, isLecturer } = require('../middleware/auth');

router.use(isAuthenticated);
router.use(isLecturer);

router.get('/dashboard', lecturerController.dashboard);
router.post('/respond-to-request', lecturerController.respondToRequest);

module.exports = router;
