const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

// Import the User model
const User = require('./models/User');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/student_lecturer_scheduler');

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Use express-ejs-layouts middleware
app.use(expressLayouts);

// Set the default layout file
app.set('layout', 'layout'); // Ensure 'layout.ejs' exists in the 'views' directory

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your_session_secret',
  resave: false,
  saveUninitialized: true
}));

// User session middleware
app.use(async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      res.locals.user = user;
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
  next();
});

// Routes
app.get('/', (req, res) => {
  res.render('home');  // Ensure 'home.ejs' exists in the 'views' directory
});
app.use('/', require('./routes/auth'));
app.use('/student', require('./routes/student'));
app.use('/lecturer', require('./routes/lecturer'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
