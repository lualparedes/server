const mongoose = require('mongoose');

const studentQuestionSchema = new mongoose.Schema({
  topic: String,
  subTopic: String,
  student: {
    name: String,
    email: String,
    picture: String
  },
  content: String,
  attachments: [String]
});

module.exports = mongoose.model('StudentQuestion', studentQuestionSchema);