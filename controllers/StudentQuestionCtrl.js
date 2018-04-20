const StudentQuestion = require('../models/StudentQuestion');

module.exports = {

  create: function(options, callback) {
    let newQuestion = new StudentQuestion({
      topic: options.topic,
      subTopic: options.subTopic,
      studentName: options.studentName,
      studentEmail: options.studentEmail,
      content: options.content,
      attachments: options.attachments.toString()
    });
    newQuestion.save(function(err, studentQuestion) {
      if (err) {
        return callback(err);
      } else {
        return callback();
      }
    });
  },

  retrieve: function(filters, callback) {
    StudentQuestion.find(filters, function(err, questions) {
      if (err) {
        console.log('ctr err');
        console.log(err);
      } else {
        console.log('ctr success');
        callback(questions);
      }
    });
  },

  delete: function() {

  }
}