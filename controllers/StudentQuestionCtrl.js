const StudentQuestion = require('../models/StudentQuestion');

module.exports = {

  create: function(options, callback) {
    let newQuestion = new StudentQuestion({
      topic: options.topic,
      subTopic: options.subTopic,
      student: {
        name: options.student.name
        email: options.student.email
        picture: options.student.picture
      },
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
        callback(err, null);
      } else {
        callback(null, questions);
      }
    });
  },

  delete: function() {

  }
}