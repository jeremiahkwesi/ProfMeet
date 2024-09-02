const User = require('../models/User');

module.exports = {
  isAuthenticated: async (req, res, next) => {
    if (req.session.userId) {
      try {
        const user = await User.findById(req.session.userId);
        if (user) {
          req.user = user;
          return next();
        }
      } catch (error) {
        console.error('Authentication error:', error);
      }
    }
    res.redirect('/login');
  },
  
  isStudent: (req, res, next) => {
    if (req.user && req.user.role === 'student') {
      return next();
    }
    res.status(403).send('Access denied');
  },
  
  isLecturer: (req, res, next) => {
    if (req.user && req.user.role === 'lecturer') {
      return next();
    }
    res.status(403).send('Access denied');
  }
};