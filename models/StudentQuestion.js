const mongoose = require('mongoose');

const studentQuestionSchema = new mongoose.Schema({
  category: String,
  subcategory: String,
  studentName: String,
  studentEmail: String,
  content: String,
  attachments: [String]
});

module.exports = mongoose.model('StudentQuestion', studentQuestionSchema);