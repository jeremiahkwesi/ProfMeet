const User = require('../models/User');
const MeetingRequest = require('../models/MeetingRequest');

exports.dashboard = async (req, res) => {
  try {
    const student = await User.findById(req.session.userId);
    const requests = await MeetingRequest.find({ student: req.session.userId }).populate('lecturer');
    
    const searchQuery = req.query.search;
    let lecturers = [];
    
    if (searchQuery) {
      lecturers = await User.find({
        role: 'lecturer',
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          { department: { $regex: searchQuery, $options: 'i' } }
        ]
      });
    }
    
    res.render('studentDashboard.ejs', { student, requests, lecturers });
  } catch (error) {
    console.error('Error loading student dashboard:', error);
    res.status(500).send('Error loading dashboard');
  }
};

exports.requestMeeting = async (req, res) => {
  try {
    const newRequest = new MeetingRequest({
      student: req.session.userId,
      lecturer: req.body.lecturerId,
      reason: req.body.reason,
      status: 'pending'
    });
    await newRequest.save();
    res.redirect('/student/dashboard'); // Redirect to the dashboard after a successful request
  } catch (error) {
    console.error('Error requesting meeting:', error);
    res.status(500).send('Error requesting meeting');
  }
};
