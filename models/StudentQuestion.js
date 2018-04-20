const mongoose = require('mongoose');

const studentQuestionSchema = new mongoose.Schema({
  topic: String,
  subTopic: String,
  studentName: String,
  studentEmail: String,
  content: String,
  attachments: [String]
});

module.exports = mongoose.model('StudentQuestion', studentQuestionSchema);