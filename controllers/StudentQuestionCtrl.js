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


module.exports = {

  create: function(req, callback) {

    let studentQuestionObj = {};

    let busboy = new Busboy({ headers: req.headers });

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);

      let saveTo = `./public/uploads/__${Date.now()}__${filename}`;
      console.log('Uploading: ' + saveTo);
      file.pipe(fs.createWriteStream(saveTo));
      studentQuestionObj['attachments'] = saveTo.slice(17);
      
      file.on('end', function() {
        console.log('File [' + fieldname + '] Finished');
      });
    });

    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
      console.log(`Field ${fieldname}: type: ${typeof val}`);
      if (fieldname === 'student') {
        studentQuestionObj[`${fieldname}`] = parse(val);
      } else {
        studentQuestionObj[`${fieldname}`] = val;
      }
    });

    busboy.on('finish', function() {
      let newQuestion = new StudentQuestion(studentQuestionObj);
      newQuestion.save(function(err, studentQuestion) {
        if (err) {
          callback(err);
        } else {
          callback();
        }
      });
    });

    req.pipe(busboy);
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