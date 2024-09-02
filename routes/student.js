const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { isAuthenticated, isStudent } = require('../middleware/auth');

// Apply authentication and role checks
router.use(isAuthenticated);
router.use(isStudent);

// Route to load student dashboard with lecturers search
router.get('/dashboard', studentController.dashboard);

// Route to handle meeting requests
router.post('/request-meeting', studentController.requestMeeting);

// Route to search for lecturers (add this route)
router.get('/search-lecturers', studentController.dashboard);

module.exports = router;
