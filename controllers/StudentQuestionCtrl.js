const StudentQuestion = require('../models/StudentQuestion');
const Busboy = require('busboy');
const fs = require('fs');


function parse(objStr) {
  let arr = objStr.split(',');
  let n = arr.length;
  let o = {};
  
  // Remove curly brackets
  while(arr[0].charAt(0) === ' ' || arr[0].charAt(0) === '{' ) {
    arr[0] = arr[0].slice(1);
  }
  while(
    arr[n-1].charAt(arr[n-1].length-1) === ' ' || 
    arr[n-1].charAt(arr[n-1].length-1) === '}'
  ) {
    arr[n-1] = arr[n-1].slice(0,-1);
  }
  
  // Create key - value pairs
  for (let i = 0; i < n; i++) {
    let divider = arr[i].search(':');
    o[arr[i].slice(0, divider).trim()] = arr[i].slice(divider+1).trim();
  }
  
  return o;
}

function deleteQuestion(_id) {

  StudentQuestion.findOne(_id, (err, question) => {

    if (err) { throw err; }

    else {

      if (question.attachments.length > 0) {
        question.attachments.forEach((filename) => {
          fs.unlink(`./public/uploads/${filename}`, (err) => {
            if (err) { throw err; }
            console.log(`${filename} was deleted`);
          });
        })
      }

      question.remove();
    }
  });  
}

// yet to be implemented
function sendAnswerEmail(to, content, attachments) {
  console.log(to, content, attachments);
}


module.exports = {

  create: (req, callback) => {

    let studentQuestionObj = { attachments: [] };

    let busboy = new Busboy({ headers: req.headers });

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

      let saveTo = `./public/uploads/__${Date.now()}__${filename}`;
      console.log('Uploading: ' + saveTo);
      file.pipe(fs.createWriteStream(saveTo));
      studentQuestionObj['attachments'].push(saveTo.slice(17));
      
      file.on('end', () => {
        console.log('File [' + fieldname + '] Finished');
      });
    });

    busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated) => {
      console.log(`Field ${fieldname}: val: ${val}`);
      if (fieldname === 'student') {
        studentQuestionObj[`${fieldname}`] = parse(val);
      } 
      else if (fieldname != 'attachments') {
        studentQuestionObj[`${fieldname}`] = val;
      }
    });

    busboy.on('finish', () => {
      let newQuestion = new StudentQuestion(studentQuestionObj);
      newQuestion.save((err, studentQuestion) => {
        if (err) {
          callback(err);
        } 
        else {
          callback();
        }
      });
    });

    req.pipe(busboy);
  },

  retrieve: (filters, callback) => {
    StudentQuestion.find(filters, (err, questions) => {
      if (err) {
        callback(err, null);
      } 
      else {
        callback(null, questions);
      }
    });
  },

  // yet to be implemented
  answer: (req, callback) => { 

    let formFields = {};

    let busboy = new Busboy({ headers: req.headers });

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    });

    busboy.on('field', (fieldname, val, fieldnameTruncated, valTruncated) => {
      console.log(`Field ${fieldname}: val: ${val}`);
      formFields[fieldname] = val;
    });

    busboy.on('finish', () => {
      deleteQuestion(formFields.questionId);
      sendAnswerEmail(formFields.userEmail, formFields.answerContent, formFields.attachments);
      callback();
    });

    req.pipe(busboy);
  }
}