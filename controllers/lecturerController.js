const User = require('../models/User');
const MeetingRequest = require('../models/MeetingRequest');

exports.dashboard = async (req, res) => {
  try {
    const lecturer = await User.findById(req.session.userId);
    const requests = await MeetingRequest.find({ lecturer: req.session.userId }).populate('student');
    res.render('lecturerDashboard.ejs', { lecturer, requests });
  } catch (error) {
    console.error('Error loading lecturer dashboard:', error);
    res.status(500).send('Error loading dashboard');
  }
};

exports.respondToRequest = async (req, res) => {
  try {
    const { requestId, status, meetingTime, meetingVenue, declineReason } = req.body;

    // Update the meeting request based on the status
    await MeetingRequest.findByIdAndUpdate(requestId, {
      status,
      meetingTime: status === 'accepted' ? meetingTime : undefined,
      meetingVenue: status === 'accepted' ? meetingVenue : undefined,
      declineReason: status === 'declined' ? declineReason : undefined
    });

    // Redirect to the lecturer dashboard
    res.redirect('/lecturer/dashboard');
  } catch (error) {
    console.error('Error responding to request:', error);
    res.status(500).send('Error responding to request');
  }
};
