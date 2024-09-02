const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
  try {
    const userData = req.body;

    const newUser = new User(userData);
    await newUser.save();
    req.session.userId = newUser._id;
    req.session.userRole = newUser.role;
    res.redirect(newUser.role === 'student' ? '/student/dashboard' : '/lecturer/dashboard');
  } catch (error) {
    console.error('Signup error:', error);
    // Preserve the form data by sending it back in case of an error
    res.render('signup', { error: 'Error creating user. Please try again.', formData: req.body });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user._id;
      req.session.userRole = user.role;
      res.redirect(user.role === 'student' ? '/student/dashboard' : '/lecturer/dashboard');
    } else {
      // Preserve the email and show the error
      res.render('login', { error: 'Invalid credentials', email });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.render('login', { error: 'Error logging in. Please try again.' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};

exports.getSignup = (req, res) => {
  res.render('signup', { error: null, formData: {} });
};

exports.getLogin = (req, res) => {
  res.render('login', { error: null, email: '' });
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.redirect('/login');
    }
    res.render('profile', { user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).send('Error loading profile');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Prevent password update through this route
    await User.findByIdAndUpdate(req.session.userId, updates, { new: true });
    res.redirect('/profile');
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).send('Error updating profile');
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.session.userId);
    req.session.destroy(err => {
      if (err) {
        console.error('Session destruction error:', err);
      }
      res.clearCookie('connect.sid');
      res.redirect('/signup');
    });
  } catch (error) {
    console.error('Delete profile error:', error);
    res.status(500).send('Error deleting profile');
  }
};


