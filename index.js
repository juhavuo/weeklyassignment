const express = require('express');
const app = express();

require('dotenv').config();

const fs = require('fs');
const json_obj = JSON.parse(fs.readFileSync('./jsons/cats.json','utf8'));
console.log(json_obj[0].time);

const multer = require('multer');

//https://stackoverflow.com/questions/32184589/renaming-an-uploaded-file-using-multer-doesnt-work-express-js
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[1];
    cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
  }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {

    res.send("hello world");
});

app.post('/upload_photo',upload.single('cat_test_image'), (req, res, next) =>{
  const filename = req.file.filename;
  console.log(filename);

  res.send(req.file);
});



app.listen(process.env.APP_PORT);
