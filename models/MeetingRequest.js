const mongoose = require('mongoose');

const meetingRequestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lecturer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  meetingTime: Date,
  meetingVenue: String,
  declineReason: String
}, { timestamps: true });

module.exports = mongoose.model('MeetingRequest', meetingRequestSchema);