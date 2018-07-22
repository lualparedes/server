const studentQuestionCtrl = require('../../controllers/StudentQuestionCtrl');

module.exports = function(router) {

  router.post('/student-questions/create', function(req, res) {
    studentQuestionCtrl.create(req, function(err) {
      if (err) {
        res.json({err: err});
      } 
      else {
        res.status(200).send('OK');
      }
    });
  });

  router.post('/student-questions/get', function(req, res) {
    studentQuestionCtrl.retrieve(req.body, function(err, questions) {
      if (err) {
        res.json({err: err});
      } 
      else {
        res.json(questions);
      }
    });
  });

  router.post('/student-questions/answer', function(req, res) {
    studentQuestionCtrl.answer(req, function(err) {
      if (err) {
        res.json({err: err});
      } 
      else {
        res.status(200).send('OK');
      }
    });
  });
}