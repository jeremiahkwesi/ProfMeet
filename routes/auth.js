const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');

// Root route
router.get('/', (req, res) => {
  res.render('home');  // Render the view file
});

router.get('/signup', authController.getSignup);
router.post('/signup', authController.signup);
router.get('/login', authController.getLogin);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/profile', isAuthenticated, authController.getProfile);
router.post('/profile/update', isAuthenticated, authController.updateProfile);
router.post('/profile/delete', isAuthenticated, authController.deleteProfile);

module.exports = router;

