const express = require('express');
const app = express();

require('dotenv').config();

const fs = require('fs');
const json_obj = JSON.parse(fs.readFileSync('./jsons/cats.json','utf8'));
console.log(json_obj[0].time);

const multer = require('multer');

const upload = multer({dest: './uploads'});

app.get('/', (req, res) => {

    res.send("hello world");
});

app.post('/upload_photo',upload.single('cat_test_image'),async (req, res) =>{
  console.log(req);
  res.send("OK");
});



app.listen(process.env.APP_PORT);
